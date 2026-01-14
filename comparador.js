// Insurance Comparison Application
// Uses Gemini API for intelligent PDF extraction

class InsuranceComparator {
    constructor() {
        this.apiKey = localStorage.getItem('geminiApiKey') || '';
        this.files = [];
        this.extractedData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkApiKey();
    }

    setupEventListeners() {
        // API Key
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        
        // File upload
        const fileInput = document.getElementById('pdfUpload');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        const uploadLabel = document.querySelector('.upload-label');
        uploadLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '#667eea';
            uploadLabel.style.background = '#e7f1ff';
        });
        
        uploadLabel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '#dee2e6';
            uploadLabel.style.background = '#f8f9fa';
        });
        
        uploadLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '#dee2e6';
            uploadLabel.style.background = '#f8f9fa';
            const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
            this.addFiles(files);
        });
        
        // Process files
        document.getElementById('processFiles').addEventListener('click', () => this.processFiles());
        
        // Export Excel
        document.getElementById('exportExcel').addEventListener('click', () => this.exportToExcel());
        
        // New comparison
        document.getElementById('newComparison').addEventListener('click', () => this.resetApp());
    }

    checkApiKey() {
        if (this.apiKey) {
            document.getElementById('apiKey').value = this.apiKey;
            this.showSection('uploadSection');
        } else {
            this.showSection('apiConfigSection');
        }
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiKey) {
            alert('Por favor ingresa una API Key válida');
            return;
        }
        
        this.apiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);
        alert('API Key guardada correctamente');
        this.showSection('uploadSection');
    }

    showSection(sectionId) {
        const sections = ['apiConfigSection', 'uploadSection', 'processingSection', 'resultsSection'];
        sections.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.addFiles(files);
    }

    addFiles(files) {
        files.forEach(file => {
            if (file.type === 'application/pdf') {
                this.files.push({
                    file: file,
                    name: file.name,
                    size: this.formatFileSize(file.size),
                    status: 'ready'
                });
            }
        });
        this.renderFileList();
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    renderFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        if (this.files.length === 0) {
            document.getElementById('processFiles').style.display = 'none';
            return;
        }

        document.getElementById('processFiles').style.display = 'block';

        this.files.forEach((fileData, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            const fileIcon = document.createElement('div');
            fileIcon.className = 'file-icon';
            fileIcon.textContent = 'PDF';
            
            const fileDetails = document.createElement('div');
            fileDetails.className = 'file-details';
            
            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = fileData.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = fileData.size;
            
            fileDetails.appendChild(fileName);
            fileDetails.appendChild(fileSize);
            
            fileInfo.appendChild(fileIcon);
            fileInfo.appendChild(fileDetails);
            
            const status = document.createElement('span');
            status.className = `file-status ${fileData.status}`;
            status.textContent = this.getStatusText(fileData.status);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'file-remove';
            removeBtn.textContent = '×';
            removeBtn.onclick = () => this.removeFile(index);
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(status);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'ready': 'Listo',
            'processing': 'Procesando...',
            'completed': 'Completado',
            'error': 'Error'
        };
        return statusMap[status] || status;
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.renderFileList();
    }

    async processFiles() {
        if (this.files.length === 0) {
            alert('Por favor carga al menos un archivo PDF');
            return;
        }

        this.showSection('processingSection');
        this.extractedData = [];

        for (let i = 0; i < this.files.length; i++) {
            const fileData = this.files[i];
            const progress = ((i + 1) / this.files.length) * 100;
            
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('processingStatus').textContent = 
                `Procesando ${fileData.name} (${i + 1}/${this.files.length})...`;

            try {
                const text = await this.extractTextFromPDF(fileData.file);
                const parsedData = await this.parseInsuranceData(text, fileData.name);
                this.extractedData.push(parsedData);
            } catch (error) {
                console.error('Error processing file:', error);
                this.extractedData.push({
                    company: fileData.name.replace('.pdf', ''),
                    error: true,
                    message: error.message
                });
            }
        }

        this.displayResults();
    }

    async extractTextFromPDF(file) {
        // Read PDF file as base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result.split(',')[1];
                    const text = await this.callGeminiAPI(base64Data, file.name);
                    resolve(text);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    async callGeminiAPI(base64Data, fileName) {
        const prompt = `Analiza este PDF de cotización de seguro empresarial y extrae la siguiente información en formato JSON:

{
  "aseguradora": "Nombre de la aseguradora",
  "coberturas": {
    "edificio_contenidos": {
      "incendio_rayo_explosion": "valor o límite",
      "extension_cubierta": "valor o límite"
    },
    "riesgos_naturaleza": {
      "terremoto": "valor o límite",
      "fenomenos_hidrometeorologicos": "valor o límite (incluye huracán, ciclón, tempestad, inundación)"
    },
    "riesgos_tecnicos": {
      "rotura_maquinaria": "valor o límite",
      "equipo_electronico": "valor o límite"
    },
    "responsabilidad_civil": {
      "general": "valor o límite",
      "arrendatario": "valor o límite",
      "productos": "valor o límite"
    }
  },
  "costos": {
    "prima_neta": "valor numérico",
    "gastos_expedicion": "valor numérico",
    "iva": "valor numérico",
    "prima_total": "valor numérico"
  },
  "deducibles": {
    "general": "descripción del deducible",
    "especificos": []
  },
  "otras_coberturas": []
}

IMPORTANTE:
- Si una cobertura no está en el PDF, usa "No cubierto"
- Para deducibles complejos, incluye el texto completo (ej: "10% sobre el daño con mínimo de 50 UMA")
- Consolida coberturas similares: "Huracán", "Ciclón", "Tempestad" = "Fenómenos Hidrometeorológicos"
- Extrae valores numéricos de los costos
- Si encuentras coberturas adicionales no listadas, agrégalas en "otras_coberturas"`;

        try {
            // Note: Google Gemini API requires the API key as a query parameter
            // This is the official API design. For production use, consider implementing
            // a backend proxy to avoid exposing the API key in the browser.
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                {
                                    inline_data: {
                                        mime_type: 'application/pdf',
                                        data: base64Data
                                    }
                                }
                            ]
                        }]
                    })
                }
            );

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = `API Error: ${errorData.error?.message || response.statusText}`;
                } catch (e) {
                    errorMessage = `API Error: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const text = data.candidates[0]?.content?.parts[0]?.text || '';
            
            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    async parseInsuranceData(responseText, fileName) {
        try {
            // Extract JSON from markdown code blocks if present
            let jsonText = responseText;
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                            responseText.match(/```\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const data = JSON.parse(jsonText);
            return {
                company: data.aseguradora || fileName.replace('.pdf', ''),
                ...data
            };
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Return a default structure if parsing fails
            return {
                company: fileName.replace('.pdf', ''),
                error: true,
                message: 'Error al parsear los datos',
                rawText: responseText.substring(0, 500)
            };
        }
    }

    displayResults() {
        this.showSection('resultsSection');
        
        const tableContainer = document.getElementById('comparisonTable');
        const table = this.createComparisonTable();
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }

    createComparisonTable() {
        const table = document.createElement('table');
        table.className = 'comparison-table';

        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const conceptHeader = document.createElement('th');
        conceptHeader.textContent = 'Concepto';
        headerRow.appendChild(conceptHeader);
        
        this.extractedData.forEach(data => {
            const th = document.createElement('th');
            th.textContent = data.company;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');

        // Edificio y Contenidos
        this.addSectionHeader(tbody, 'EDIFICIO Y CONTENIDOS');
        this.addRow(tbody, 'Incendio, Rayo y Explosión', 'coberturas.edificio_contenidos.incendio_rayo_explosion');
        this.addRow(tbody, 'Extensión de Cubierta', 'coberturas.edificio_contenidos.extension_cubierta');

        // Riesgos de la Naturaleza
        this.addSectionHeader(tbody, 'RIESGOS DE LA NATURALEZA');
        this.addRow(tbody, 'Terremoto y Erupción Volcánica', 'coberturas.riesgos_naturaleza.terremoto');
        this.addRow(tbody, 'Fenómenos Hidrometeorológicos', 'coberturas.riesgos_naturaleza.fenomenos_hidrometeorologicos');

        // Riesgos Técnicos
        this.addSectionHeader(tbody, 'RIESGOS TÉCNICOS');
        this.addRow(tbody, 'Rotura de Maquinaria', 'coberturas.riesgos_tecnicos.rotura_maquinaria');
        this.addRow(tbody, 'Equipo Electrónico', 'coberturas.riesgos_tecnicos.equipo_electronico');

        // Responsabilidad Civil
        this.addSectionHeader(tbody, 'RESPONSABILIDAD CIVIL');
        this.addRow(tbody, 'RC General', 'coberturas.responsabilidad_civil.general');
        this.addRow(tbody, 'RC Arrendatario', 'coberturas.responsabilidad_civil.arrendatario');
        this.addRow(tbody, 'RC Productos', 'coberturas.responsabilidad_civil.productos');

        // Costos
        this.addSectionHeader(tbody, 'COSTOS');
        this.addRow(tbody, 'Prima Neta', 'costos.prima_neta', true);
        this.addRow(tbody, 'Gastos de Expedición', 'costos.gastos_expedicion', true);
        this.addRow(tbody, 'IVA', 'costos.iva', true);
        this.addRow(tbody, 'Prima Total', 'costos.prima_total', true);

        // Additional coverages
        this.addAdditionalCoverages(tbody);

        table.appendChild(tbody);
        return table;
    }

    addSectionHeader(tbody, title) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = this.extractedData.length + 1;
        cell.className = 'section-header';
        cell.textContent = title;
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    addRow(tbody, label, path, isCost = false) {
        const row = document.createElement('tr');
        if (isCost) row.className = 'cost-row';

        const conceptCell = document.createElement('td');
        conceptCell.className = 'concept-cell';
        conceptCell.textContent = label;
        row.appendChild(conceptCell);
        
        this.extractedData.forEach(data => {
            const value = this.getNestedValue(data, path);
            const displayValue = value || 'No cubierto';
            const cellClass = (!value || value === 'No cubierto') ? 'no-cubierto' : '';
            
            const cell = document.createElement('td');
            if (cellClass) cell.className = cellClass;
            cell.textContent = displayValue;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    addAdditionalCoverages(tbody) {
        // Collect all additional coverages
        const allAdditionalCoverages = new Set();
        this.extractedData.forEach(data => {
            if (data.otras_coberturas && Array.isArray(data.otras_coberturas)) {
                data.otras_coberturas.forEach(cov => {
                    if (typeof cov === 'string') {
                        allAdditionalCoverages.add(cov);
                    } else if (cov.nombre) {
                        allAdditionalCoverages.add(cov.nombre);
                    }
                });
            }
        });

        if (allAdditionalCoverages.size > 0) {
            this.addSectionHeader(tbody, 'COBERTURAS ADICIONALES');
            allAdditionalCoverages.forEach(coverage => {
                const row = document.createElement('tr');
                
                const conceptCell = document.createElement('td');
                conceptCell.className = 'concept-cell';
                conceptCell.textContent = coverage;
                row.appendChild(conceptCell);
                
                this.extractedData.forEach(data => {
                    let hasIt = false;
                    if (data.otras_coberturas && Array.isArray(data.otras_coberturas)) {
                        hasIt = data.otras_coberturas.some(cov => 
                            (typeof cov === 'string' && cov === coverage) ||
                            (cov.nombre === coverage)
                        );
                    }
                    const cellClass = !hasIt ? 'no-cubierto' : '';
                    const displayValue = hasIt ? 'Incluida' : 'No cubierto';
                    
                    const cell = document.createElement('td');
                    if (cellClass) cell.className = cellClass;
                    cell.textContent = displayValue;
                    row.appendChild(cell);
                });

                tbody.appendChild(row);
            });
        }
    }

    exportToExcel() {
        // Create workbook
        const wb = XLSX.utils.book_new();

        // Prepare data for Excel
        const data = [
            ['COMPARACIÓN DE SEGUROS EMPRESARIALES'],
            [],
            ['Concepto', ...this.extractedData.map(d => d.company)],
            [],
            ['EDIFICIO Y CONTENIDOS'],
            ['Incendio, Rayo y Explosión', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.edificio_contenidos.incendio_rayo_explosion') || 'No cubierto')],
            ['Extensión de Cubierta', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.edificio_contenidos.extension_cubierta') || 'No cubierto')],
            [],
            ['RIESGOS DE LA NATURALEZA'],
            ['Terremoto y Erupción Volcánica', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.riesgos_naturaleza.terremoto') || 'No cubierto')],
            ['Fenómenos Hidrometeorológicos', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.riesgos_naturaleza.fenomenos_hidrometeorologicos') || 'No cubierto')],
            [],
            ['RIESGOS TÉCNICOS'],
            ['Rotura de Maquinaria', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.riesgos_tecnicos.rotura_maquinaria') || 'No cubierto')],
            ['Equipo Electrónico', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.riesgos_tecnicos.equipo_electronico') || 'No cubierto')],
            [],
            ['RESPONSABILIDAD CIVIL'],
            ['RC General', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.responsabilidad_civil.general') || 'No cubierto')],
            ['RC Arrendatario', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.responsabilidad_civil.arrendatario') || 'No cubierto')],
            ['RC Productos', ...this.extractedData.map(d => this.getNestedValue(d, 'coberturas.responsabilidad_civil.productos') || 'No cubierto')],
            [],
            ['COSTOS'],
            ['Prima Neta', ...this.extractedData.map(d => this.getNestedValue(d, 'costos.prima_neta') || 'No cubierto')],
            ['Gastos de Expedición', ...this.extractedData.map(d => this.getNestedValue(d, 'costos.gastos_expedicion') || 'No cubierto')],
            ['IVA', ...this.extractedData.map(d => this.getNestedValue(d, 'costos.iva') || 'No cubierto')],
            ['Prima Total', ...this.extractedData.map(d => this.getNestedValue(d, 'costos.prima_total') || 'No cubierto')]
        ];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Set column widths
        ws['!cols'] = [
            { wch: 40 }, // Concepto column
            ...this.extractedData.map(() => ({ wch: 25 }))
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Comparación');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Comparacion_Seguros_${timestamp}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
    }

    resetApp() {
        this.files = [];
        this.extractedData = [];
        document.getElementById('fileList').innerHTML = '';
        document.getElementById('pdfUpload').value = '';
        this.showSection('uploadSection');
    }
}

// Initialize the application
let comparator;
document.addEventListener('DOMContentLoaded', () => {
    comparator = new InsuranceComparator();
});

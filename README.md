# DIA-A-DIA- Project

This repository contains two applications:

1. **Comparador de Seguros Empresariales** - Professional insurance comparison tool with AI-powered PDF extraction
2. **Sudoku Game** - A fun and interactive Sudoku game

---

## 🏢 Comparador de Seguros Empresariales

Aplicación web profesional para comparar cotizaciones de seguros empresariales utilizando inteligencia artificial (Google Gemini API).

### Características Principales

- **Extracción Inteligente con IA**: Procesa múltiples PDFs de cotizaciones usando la API de Gemini
- **Mapeo Semántico**: Consolida automáticamente coberturas similares (ej: "Huracán", "Ciclón" → "Fenómenos Hidrometeorológicos")
- **Cuadro Comparativo Profesional**: Organiza la información en secciones claras y estructuradas
- **Exportación a Excel**: Descarga los resultados en formato Excel profesional
- **Manejo Inteligente de Datos**: 
  - Identifica coberturas no incluidas ("No cubierto")
  - Extrae deducibles complejos con sus condiciones completas
  - Detecta y agrega coberturas adicionales no estándar

### Estructura del Cuadro Comparativo

El sistema organiza la información en las siguientes secciones:

1. **Edificio y Contenidos**
   - Incendio, Rayo y Explosión
   - Extensión de Cubierta

2. **Riesgos de la Naturaleza**
   - Terremoto y Erupción Volcánica
   - Fenómenos Hidrometeorológicos

3. **Riesgos Técnicos**
   - Rotura de Maquinaria
   - Equipo Electrónico

4. **Responsabilidad Civil**
   - RC General
   - RC Arrendatario
   - RC Productos

5. **Costos**
   - Prima Neta
   - Gastos de Expedición
   - IVA
   - Prima Total

6. **Coberturas Adicionales** (detectadas automáticamente)

### Cómo Usar

1. **Configurar API Key**:
   - Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Genera una API Key de Gemini
   - Ingresa la clave en la aplicación

2. **Cargar PDFs**:
   - Arrastra o selecciona múltiples archivos PDF de cotizaciones
   - La aplicación soporta archivos de diferentes aseguradoras (GNP, Inbursa, Afirme, Tokio Marine, etc.)

3. **Procesar**:
   - Haz clic en "Procesar Cotizaciones"
   - La IA extraerá y consolidará la información automáticamente

4. **Exportar**:
   - Revisa el cuadro comparativo generado
   - Descarga el resultado en formato Excel

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para API de Gemini)
- API Key de Google Gemini (gratuita en AI Studio)

### Nota de Seguridad

**Importante**: Esta aplicación está diseñada para uso individual o en entornos de desarrollo. La API Key de Gemini se almacena en el navegador y se envía directamente desde el cliente. Para uso en producción, se recomienda:

1. Implementar un backend/proxy que maneje las llamadas a la API de Gemini
2. No exponer la API Key en el código del cliente
3. Agregar autenticación y autorización apropiadas
4. Implementar rate limiting y monitoreo de uso

Para prototipos y uso personal, la configuración actual es adecuada, ya que Google Gemini permite el uso de API Keys en aplicaciones del lado del cliente con las restricciones apropiadas configuradas en Google Cloud Console.

### Archivos

- `comparador-seguros.html` - Interfaz principal
- `comparador.css` - Estilos profesionales
- `comparador.js` - Lógica de la aplicación y integración con Gemini API

### Tecnologías Utilizadas

- HTML5, CSS3, JavaScript (Vanilla)
- Google Gemini API (para extracción inteligente de PDFs)
- SheetJS (XLSX) para exportación a Excel
- LocalStorage para guardar configuración

---

## 🎮 Sudoku Game

A fun and interactive Sudoku game built with HTML, CSS, and JavaScript.

## How to Play

1. Open `index.html` in your web browser
2. Click "New Game" to start a new puzzle
3. Select a difficulty level (Easy, Medium, or Hard)
4. Click on an empty cell to select it
5. Type a number (1-9) to fill the cell
6. Press Delete or Backspace to clear a cell
7. Use "Check Solution" to verify your answers
8. Use "Get Hint" if you need help

## Saving Your Progress

**Your game is automatically saved** as you play! The game saves your progress every time you enter or delete a number.

- **Manual Save**: Click the "Save Game" button to manually save your current game
- **Load Game**: Click the "Load Game" button to restore your last saved game
- **Auto-Resume**: When you open the game again, it will automatically ask if you want to continue your saved game

**Note**: Your saved game is stored in your browser's local storage. Clearing your browser data will delete your saved game.

## Game Rules

- Each row must contain the digits 1-9 without repetition
- Each column must contain the digits 1-9 without repetition
- Each 3x3 box must contain the digits 1-9 without repetition

## Features

- Three difficulty levels: Easy, Medium, and Hard
- Interactive game board with visual feedback
- Hint system to help when you're stuck
- Solution checking
- **Auto-save and manual save/load functionality**
- **Game progress persists between sessions**
- Responsive design for mobile and desktop
- Beautiful gradient background and smooth animations

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- Vanilla JavaScript (no frameworks or libraries)
- LocalStorage API for saving game state

## Playing the Game

Simply open the `index.html` file in any modern web browser. No installation or server setup required!

# Guía de Inicio Rápido - DIA-A-DIA

## 🚀 Cómo Empezar

Esta guía te ayudará a dar los primeros pasos en el desarrollo del proyecto DIA-A-DIA.

## Paso 1: Decidir la Plataforma

### Opción A: Aplicación Web (Recomendado para empezar)

**Ventajas:**
- Accesible desde cualquier dispositivo
- Fácil de desplegar
- No requiere instalación
- Un solo código para todas las plataformas

**Comenzar con React:**
```bash
npx create-react-app dia-a-dia
cd dia-a-dia
npm install
npm start
```

**O con Vite (más rápido):**
```bash
npm create vite@latest dia-a-dia -- --template react
cd dia-a-dia
npm install
npm run dev
```

### Opción B: Aplicación Móvil

**Con React Native:**
```bash
npx react-native init DiaADia
cd DiaADia
npm run android  # o npm run ios
```

### Opción C: Aplicación de Escritorio

**Con Electron:**
```bash
git clone https://github.com/electron/electron-quick-start dia-a-dia
cd dia-a-dia
npm install
npm start
```

## Paso 2: Instalar Dependencias Útiles

### Para React Web:

```bash
# Routing
npm install react-router-dom

# Gestión de estado
npm install zustand
# O alternativamente
npm install redux @reduxjs/toolkit react-redux

# UI Components
npm install @mui/material @emotion/react @emotion/styled
# O alternativamente
npm install tailwindcss

# Fechas
npm install date-fns
# O alternativamente
npm install dayjs

# Gráficos
npm install recharts
# O alternativamente
npm install chart.js react-chartjs-2

# Iconos
npm install react-icons

# Formularios
npm install react-hook-form

# Almacenamiento local
npm install localforage
```

## Paso 3: Estructura de Carpetas

Crea esta estructura en tu proyecto:

```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── diary/           # Componentes del diario
│   ├── habits/          # Componentes de hábitos
│   └── tasks/           # Componentes de tareas
├── pages/
│   ├── Home.jsx
│   ├── Diary.jsx
│   ├── Habits.jsx
│   └── Tasks.jsx
├── services/
│   ├── storage.js       # Manejo de almacenamiento
│   └── api.js           # Llamadas a API (futuro)
├── utils/
│   ├── helpers.js
│   └── constants.js
├── hooks/               # Custom React hooks
│   └── useLocalStorage.js
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```

## Paso 4: Crear el Primer Componente

### Ejemplo: Entrada de Diario Simple

```jsx
// src/components/diary/DiaryEntry.jsx
import React, { useState } from 'react';

function DiaryEntry() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const handleSave = () => {
    if (entry.trim()) {
      const newEntry = {
        id: Date.now(),
        content: entry,
        date: new Date().toISOString(),
      };
      setEntries([newEntry, ...entries]);
      setEntry('');
      // Guardar en localStorage
      localStorage.setItem('diary-entries', JSON.stringify([newEntry, ...entries]));
    }
  };

  return (
    <div className="diary-entry">
      <h2>Mi Diario</h2>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="¿Cómo estuvo tu día?"
        rows={5}
        style={{ width: '100%', padding: '10px' }}
      />
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        Guardar Entrada
      </button>
      
      <div className="entries-list" style={{ marginTop: '20px' }}>
        {entries.map((e) => (
          <div key={e.id} style={{ 
            padding: '10px', 
            margin: '10px 0', 
            border: '1px solid #ccc',
            borderRadius: '5px' 
          }}>
            <small>{new Date(e.date).toLocaleDateString()}</small>
            <p>{e.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryEntry;
```

## Paso 5: Implementar Almacenamiento Local

### Crear un servicio de storage:

```javascript
// src/services/storage.js

const STORAGE_KEYS = {
  DIARY: 'dia-a-dia-diary',
  HABITS: 'dia-a-dia-habits',
  TASKS: 'dia-a-dia-tasks',
};

export const storage = {
  // Guardar datos
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  },

  // Obtener datos
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  },

  // Eliminar datos
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },

  // Limpiar todo
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};

export { STORAGE_KEYS };
```

## Paso 6: Agregar Estilos Básicos

### Con CSS vanilla:

```css
/* src/styles/global.css */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.button {
  background-color: #4F46E5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  background-color: #4338CA;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}
```

## Paso 7: Testing Básico

### Configurar Jest (viene con create-react-app):

```javascript
// src/components/diary/__tests__/DiaryEntry.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import DiaryEntry from '../DiaryEntry';

test('renders diary entry component', () => {
  render(<DiaryEntry />);
  const heading = screen.getByText(/Mi Diario/i);
  expect(heading).toBeInTheDocument();
});

test('can add a new entry', () => {
  render(<DiaryEntry />);
  const textarea = screen.getByPlaceholderText(/¿Cómo estuvo tu día?/i);
  const button = screen.getByText(/Guardar Entrada/i);
  
  fireEvent.change(textarea, { target: { value: 'Tuve un gran día!' } });
  fireEvent.click(button);
  
  expect(screen.getByText(/Tuve un gran día!/i)).toBeInTheDocument();
});
```

## Paso 8: Deployment

### Opciones gratuitas para desplegar:

1. **Vercel** (Recomendado para React):
```bash
npm install -g vercel
vercel
```

2. **Netlify**:
```bash
npm install -g netlify-cli
netlify deploy
```

3. **GitHub Pages**:
```bash
npm install gh-pages --save-dev
# Agregar al package.json:
# "homepage": "https://tuusuario.github.io/dia-a-dia",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"
npm run deploy
```

## 📋 Checklist de Desarrollo

### Fase MVP (Primeras 2 semanas):
- [ ] Configurar proyecto base
- [ ] Crear layout principal
- [ ] Implementar entrada de diario básica
- [ ] Agregar almacenamiento local
- [ ] Diseñar interfaz responsive
- [ ] Probar en diferentes navegadores

### Próximos Pasos:
- [ ] Sistema de autenticación
- [ ] Base de datos (Firebase/Supabase)
- [ ] Seguimiento de hábitos
- [ ] Lista de tareas
- [ ] Gráficos y estadísticas

## 🎨 Recursos de Diseño

### Paletas de Colores:
- [Coolors.co](https://coolors.co/) - Generador de paletas
- [Adobe Color](https://color.adobe.com/)

### Iconos:
- [React Icons](https://react-icons.github.io/react-icons/)
- [Heroicons](https://heroicons.com/)
- [Font Awesome](https://fontawesome.com/)

### Fuentes:
- [Google Fonts](https://fonts.google.com/)
- Recomendadas: Inter, Roboto, Poppins, Montserrat

### Componentes UI:
- [Material-UI](https://mui.com/)
- [Chakra UI](https://chakra-ui.com/)
- [Ant Design](https://ant.design/)
- [shadcn/ui](https://ui.shadcn.com/)

## 💡 Tips de Desarrollo

1. **Commitea frecuentemente**: Haz commits pequeños y descriptivos
2. **Comenta tu código**: Pero solo cuando sea necesario
3. **Usa nombres descriptivos**: Variables y funciones claras
4. **Mantén componentes pequeños**: Cada componente una responsabilidad
5. **Piensa en mobile first**: Diseña primero para móvil
6. **Testea temprano**: No dejes las pruebas para el final

## 🆘 Recursos de Ayuda

- [Stack Overflow](https://stackoverflow.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [React Documentation](https://react.dev/)
- [CSS Tricks](https://css-tricks.com/)
- [Dev.to](https://dev.to/)

## 🎯 Siguientes Pasos Inmediatos

1. Elige tu stack tecnológico (React recomendado)
2. Inicializa tu proyecto
3. Crea el primer componente funcional
4. Implementa almacenamiento local
5. Agrega estilos básicos
6. Haz tu primer commit

---

**¿Listo para comenzar? ¡Manos a la obra!** 🚀

Si tienes preguntas específicas sobre alguna parte del desarrollo, no dudes en preguntar.

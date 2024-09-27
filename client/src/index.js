// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Nota: ahora utilizamos 'react-dom/client'
import './styles/index.css';
import App from './App';

// Crear el root con el nuevo API de React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

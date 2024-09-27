// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Importar BrowserRouter

// Crear el root con el nuevo API de React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolver la aplicación con BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

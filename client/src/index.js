import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// Contextos
import { LeaderboardProvider } from './context/LeaderboardContext';
import { FavoritosProvider } from './context/FavoritosContext'; // Contexto Favoritos que hemos creado

// Crear el root con el nuevo API de React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Función auxiliar para envolver `App` en múltiples contextos
const AppWithProviders = () => (
  <LeaderboardProvider>
    <FavoritosProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FavoritosProvider>
  </LeaderboardProvider>
);

root.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);

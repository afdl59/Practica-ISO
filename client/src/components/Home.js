// src/components/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    // Verifica si las cookies ya han sido aceptadas
    return localStorage.getItem('cookiesAccepted') === 'true';
  });

  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', true);
  };

  return (
    <div className="home-container">
      <h1>Bienvenido a Futbol360</h1>
      <p>Para acceder a todas las funcionalidades de Futbol360, inicia sesión o crea una cuenta.</p>
      <div className="auth-links">
        <Link to="/login" className="btn">Iniciar Sesión</Link>
        <Link to="/register" className="btn">Registrarse</Link>
      </div>

      {/* Ventana de cookies */}
      {!cookiesAccepted && (
        <div className="cookie-banner">
          <p>Utilizamos cookies para mejorar tu experiencia. Al continuar, aceptas el uso de cookies.</p>
          <button className="btn-accept-cookies" onClick={handleAcceptCookies}>Aceptar</button>
        </div>
      )}
    </div>
  );
}

export default Home;


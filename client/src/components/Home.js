import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false); // Inicializa siempre en false

  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
    // No se almacena en localStorage, el banner aparecerá siempre al cargar la página
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

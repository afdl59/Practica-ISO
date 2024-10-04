import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false); // Estado para controlar el banner de cookies
  const [showPreferences, setShowPreferences] = useState(false); // Mostrar la ventana de preferencias de cookies
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,  // Siempre activado
    analytics: false,
    marketing: false
  });

  const handleAcceptAll = () => {
    setCookiePreferences({ essential: true, analytics: true, marketing: true });
    setCookiesAccepted(true);
  };

  const handleRejectAll = () => {
    setCookiePreferences({ essential: true, analytics: false, marketing: false });
    setCookiesAccepted(true);
  };

  const handleSavePreferences = () => {
    setCookiesAccepted(true);
    setShowPreferences(false); // Oculta la ventana de preferencias
  };

  const handleTogglePreferences = () => {
    setShowPreferences(!showPreferences); // Mostrar/ocultar preferencias
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
          <p>Utilizamos cookies para personalizar tu experiencia. Elige tus preferencias a continuación.</p>
          <div className="cookie-buttons">
            <button className="btn-accept-cookies" onClick={handleAcceptAll}>Aceptar todas</button>
            <button className="btn-reject-cookies" onClick={handleRejectAll}>Rechazar todas</button>
            <button className="btn-preferences-cookies" onClick={handleTogglePreferences}>Gestionar preferencias</button>
          </div>
        </div>
      )}

      {/* Ventana de preferencias de cookies */}
      {showPreferences && (
        <div className="cookie-preferences">
          <h2>Preferencias de cookies</h2>
          <p>Elige qué tipos de cookies deseas activar.</p>
          <div className="cookie-options">
            <div>
              <input type="checkbox" checked disabled /> Cookies esenciales (siempre activas)
            </div>
            <div>
              <input
                type="checkbox"
                checked={cookiePreferences.analytics}
                onChange={() =>
                  setCookiePreferences({ ...cookiePreferences, analytics: !cookiePreferences.analytics })
                }
              />{' '}
              Cookies de análisis
            </div>
            <div>
              <input
                type="checkbox"
                checked={cookiePreferences.marketing}
                onChange={() =>
                  setCookiePreferences({ ...cookiePreferences, marketing: !cookiePreferences.marketing })
                }
              />{' '}
              Cookies de marketing
            </div>
          </div>
          <button className="btn-save-preferences" onClick={handleSavePreferences}>Guardar preferencias</button>
        </div>
      )}
    </div>
  );
}

export default Home;


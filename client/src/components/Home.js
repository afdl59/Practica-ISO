function Home() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false); // Estado para controlar el banner de cookies
  const [showPreferences, setShowPreferences] = useState(false); // Mostrar la ventana de preferencias de cookies
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Siempre activado
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) {
      setCookiesAccepted(true);
      setCookiePreferences(
        JSON.parse(localStorage.getItem('cookiePreferences')) || cookiePreferences
      );
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setCookiePreferences(preferences);
    setCookiesAccepted(true);
  };

  const handleRejectAll = () => {
    const preferences = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setCookiePreferences(preferences);
    setCookiesAccepted(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setCookiesAccepted(true);
    setShowPreferences(false); // Oculta la ventana de preferencias
  };

  const handleTogglePreferences = () => {
    setShowPreferences(!showPreferences); // Mostrar/ocultar preferencias
  };

  return (
    <div className="home-container">
      {/* Video de fondo */}
      <video autoPlay loop muted className="video-background">
        <source src={VideoFondo} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Contenido principal */}
      <div className="text-container">
        <h1>Bienvenido a Futbol360</h1>
        <p>
          Para acceder a todas las funcionalidades de Futbol360, inicia sesión o
          crea una cuenta.
        </p>
      </div>
      <div className="auth-links">
        <a href="/login" className="btn">
          Iniciar Sesión
        </a>
        <a href="/register" className="btn">
          Registrarse
        </a>
      </div>

      {/* Modal de cookies */}
      {!cookiesAccepted && (
        <div className="cookie-modal">
          <div className="cookie-content">
            <img src={logo} alt="Logo" className="cookie-logo" />
            <h2>Aviso de privacidad</h2>
            <p>
              Utilizamos cookies para personalizar tu experiencia. Elige tus
              preferencias o acepta todas las cookies.
            </p>
            <div className="cookie-buttons">
              <button
                className="btn-accept-cookies"
                onClick={handleAcceptAll}
              >
                Aceptar todas
              </button>
              <button
                className="btn-reject-cookies"
                onClick={handleRejectAll}
              >
                Rechazar todas
              </button>
              <button
                className="btn-preferences-cookies"
                onClick={handleTogglePreferences}
              >
                Gestionar preferencias
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ventana de preferencias de cookies */}
      {showPreferences && (
        <div className="cookie-preferences-modal">
          <div className="cookie-preferences-content">
            <h2>Preferencias de cookies</h2>
            <p>Elige qué tipos de cookies deseas activar.</p>
            <div className="cookie-options">
              <div>
                <input type="checkbox" checked disabled /> Cookies esenciales
                (siempre activas)
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={cookiePreferences.analytics}
                  onChange={() =>
                    setCookiePreferences({
                      ...cookiePreferences,
                      analytics: !cookiePreferences.analytics,
                    })
                  }
                />{' '}
                Cookies de análisis
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={cookiePreferences.marketing}
                  onChange={() =>
                    setCookiePreferences({
                      ...cookiePreferences,
                      marketing: !cookiePreferences.marketing,
                    })
                  }
                />{' '}
                Cookies de marketing
              </div>
            </div>
            <button
              className="btn-save-preferences"
              onClick={handleSavePreferences}
            >
              Guardar preferencias
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

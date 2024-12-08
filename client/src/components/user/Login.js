import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/Login.css';
import botanike1 from '../../assets/patrocinio/botanike1.jpeg';
import botanike2 from '../../assets/patrocinio/botanike2.jpeg';
import botanike3 from '../../assets/patrocinio/botanike3.jpeg';
import botanike4 from '../../assets/patrocinio/botanike4.jpeg';

function Login() {
  const [isPremium, setIsPremium] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  function handleChange(e) {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        let username = data.username;
        const premiumResponse = await fetch(`/api/users/${username}/premium-status`, {
          method: 'GET', // Especificar el método
          credentials: 'include' // Incluir cookies de autenticación
        });
        const premiumData = await premiumResponse.json();
        if (premiumResponse.ok && premiumData.isPremium !== undefined) {
          setIsPremium(premiumData.isPremium);
        }
        console.log("Estado actual de isPremium", isPremium);
      } catch (err) {
        console.error('Error verificando la sesión:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      setSuccess('Inicio de sesión exitoso');
      navigate('/'); // Redirigir a la página de inicio
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
      <div className="auth-page">
        {isPremium === false && (
          <div className="ads-section">
            {/* Contenedor de productos sugeridos */}
            <div className="product-carousel">
                <div className="carousel-container">
                    {/* Producto 1 */}
                    <div className="product">
                        <a href="https://www.futbolemotion.com/es/comprar/bota-de-futbol/nike/air-zoom-mercurial-superfly-10-academy-fgmg-volt-black?gad_source=1&gclid=Cj0KCQiAgdC6BhCgARIsAPWNWH2boBMT9GHFHmySym3Q8-9kXdmWNCiMxL4-Smym4wQKnmSVxsgXxY0aAnyGEALw_wcB" target="_blank" rel="noopener noreferrer">
                            <img src={botanike1} alt="Producto 1" />
                        </a>
                        <p>Bota Nike Mercurial Air</p>
                        <span>53,99 €</span>
                    </div>
                    {/* Producto 2 */}
                    <div className="product">
                        <a href="https://www.futbolemotion.com/es/comprar/bota-de-futbol/nike/mercurial-air-zoom-vapor-16-academy-fgmg-glacier-blue-blue-orbit?gad_source=1&gclid=Cj0KCQiAgdC6BhCgARIsAPWNWH2l6s-7bmd3FPcsQqflpok3NoIQYiOqolpvbI9S7wquWg_cPgOnVDsaAjRCEALw_wcB" target="_blank" rel="noopener noreferrer">
                            <img src={botanike2} alt="Producto 2" />
                        </a>
                        <p>Bota Nike Air Zoom Mercurial Superfly 10</p>
                        <span>89,99 €</span>
                    </div>
                    {/* Producto 3 */}
                    <div className="product">
                        <a href="https://www.amazon.es/BLBK-Profesionales-Exteriores-Artificial-competici%C3%B3n/dp/B0DCW97Z2Z/ref=asc_df_B0D9VHFJZX?mcid=f986778da76c3291850e78a5d943fefb&tag=googshopes-21&linkCode=df0&hvadid=706993575057&hvpos=&hvnetw=g&hvrand=11766055878718087285&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1005493&hvtargid=pla-2333446893046&gad_source=1&th=1&psc=1" target="_blank" rel="noopener noreferrer">
                            <img src={botanike3} alt="Producto 3" />
                        </a>
                        <p>Bota Nike Air Mercurial Beige</p>
                        <span>39,98 €</span>
                    </div>
                    {/* Producto 4 */}
                    <div className="product">
                        <a href="https://www.amazon.es/BLBK-Profesionales-Exteriores-Artificial-competici%C3%B3n/dp/B0D8LN9XJS/ref=asc_df_B0D9VHFJZX?mcid=f986778da76c3291850e78a5d943fefb&tag=googshopes-21&linkCode=df0&hvadid=706993575057&hvpos=&hvnetw=g&hvrand=11766055878718087285&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1005493&hvtargid=pla-2333446893046&gad_source=1&th=1&psc=1" target="_blank" rel="noopener noreferrer">
                            <img src={botanike4} alt="Producto 4" />
                        </a>
                        <p>Bota Nike Air Mercurial Verde</p>
                        <span>39,00 €</span>
                    </div>
                </div>
            </div>

            {/* Contenedor de videos promocionales */}
            <div className="prediction-panel">
                <div className="video-container" onClick={() => window.open('https://www.cupraofficial.es/ofertas/formentor', '_blank')}>
                    <iframe
                        src="https://www.youtube.com/embed/eUaywO-fq0I?autoplay=1&mute=1&loop=1&playlist=eUaywO-fq0I"
                        title="Anuncio promocional 1"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="video-container" onClick={() => window.open('https://www.playstation.com/es-es/', '_blank')}>
                    <iframe
                        src="https://www.youtube.com/embed/GWiFgSreYKw?autoplay=1&mute=1&loop=1&playlist=GWiFgSreYKw"
                        title="Anuncio promocional 2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="video-container" onClick={() => window.open('https://www.heineken.com/es/es/agegateway?returnurl=%2fes%2fes%2fhome', '_blank')}>
                    <iframe
                        src="https://www.youtube.com/embed/i0Wtxu5TI6Y?autoplay=1&mute=1&loop=1&playlist=i0Wtxu5TI6Y"
                        title="Anuncio promocional 3"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            {/* Contenedor de videos destacados */}
            <div className="full-width-info-panel">
                <iframe
                    src="https://www.youtube.com/embed/Wbh8HMmU-Gs?autoplay=1&mute=1&loop=1&playlist=Wbh8HMmU-Gs"
                    title="Video destacado"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
          </div>    
        )}
        {/* Contenedor de inicio de sesión */}
        <div className="auth-container">
          <h1>Iniciar Sesión en Futbol360</h1>
          <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  name="identifier"
                  placeholder="Nombre de usuario o Correo Electrónico"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
              />
              <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
              />
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit">Iniciar Sesión</button>
          </form>
          <hr />
          <button
              className="google-login-button"
              onClick={() => window.location.href = '/api/auth/google'}
          >
              Iniciar sesión con Google
          </button>
          <button
              className="twitter-login-button"
              onClick={() => window.location.href = '/api/auth/twitter'}
          >
            Iniciar sesión con Twitter
          </button>
        </div>
      </div>
  );
}

export default Login;


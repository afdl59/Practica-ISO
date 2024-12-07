import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.css';

function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

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

    return (
        <div className="auth-container">
<div className="prediction-panel">
  {/* Video 1 */}
  <div className="video-container" onClick={() => window.open('https://www.cupraofficial.es/ofertas/formentor', '_blank')}>
    <iframe
      src="https://www.youtube.com/embed/eUaywO-fq0I?autoplay=1&mute=1&loop=1&playlist=eUaywO-fq0I"
      title="Anuncio promocional 1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen>
    </iframe>
  </div>

  {/* Video 2 */}
  <div className="video-container" onClick={() => window.open('https://www.playstation.com/es-es/', '_blank')}>
    <iframe
      src="https://www.youtube.com/embed/GWiFgSreYKw?autoplay=1&mute=1&loop=1&playlist=GWiFgSreYKw"
      title="Anuncio promocional 2"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen>
    </iframe>
  </div>

  {/* Video 3 */}
  <div className="video-container" onClick={() => window.open('https://www.heineken.com/es/es/agegateway?returnurl=%2fes%2fes%2fhome', '_blank')}>
    <iframe
      src="https://www.youtube.com/embed/i0Wtxu5TI6Y?autoplay=1&mute=1&loop=1&playlist=i0Wtxu5TI6Y"
      title="Anuncio promocional 3"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen>
    </iframe>
  </div>
</div>


<div className="info-panel">
  <iframe
    src="https://www.youtube.com/embed/TkHSuJUY5oA?autoplay=1&mute=1&loop=1&playlist=TkHSuJUY5oA"
    title="Video destacado"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen>
  </iframe>
</div>

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
        </div>
    );
}

export default Login;



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
                <iframe
                    src="https://www.youtube.com/embed/eUaywO-fq0I?autoplay=1&mute=1&loop=1&playlist=eUaywO-fq0I"
                    title="Anuncio promocional 1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
                <a className="promo-button" href="https://www.cupraofficial.es/ofertas/formentor" target="_blank" rel="noopener noreferrer">
                    Accede a la oferta
                </a>

                {/* Video 2 */}
                <iframe
                    src="https://www.youtube.com/embed/GWiFgSreYKw?autoplay=1&mute=1&loop=1&playlist=GWiFgSreYKw"
                    title="Anuncio promocional 2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
                <a className="promo-button" href="https://www.cupraofficial.es/ofertas/formentor" target="_blank" rel="noopener noreferrer">
                    Descubre más
                </a>

                {/* Video 3 */}
                <iframe
                    src="https://www.youtube.com/embed/i0Wtxu5TI6Y?autoplay=1&mute=1&loop=1&playlist=i0Wtxu5TI6Y"
                    title="Anuncio promocional 3"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
                <a className="promo-button" href="https://www.cupraofficial.es/ofertas/formentor" target="_blank" rel="noopener noreferrer">
                    Más información
                </a>
            </div>

            <div className="info-panel">
                <h2>HAZ TUS PREDICCIONES</h2>
                <p>
                    Participa en nuestras predicciones y demuestra tu conocimiento.
                    Compite con otros usuarios y gana recompensas.
                </p>
                <button>¡Empieza ahora!</button>
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



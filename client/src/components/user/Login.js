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
          <div class="prediction-panel">
  <div class="ad-container">
    <iframe
      width="100%"
      height="200"
      src="https://www.youtube.com/embed/eUaywO-fq0I"
      title="YouTube video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
    <p class="ad-description">Disfruta del video promocional y descubre más sobre nuestros servicios.</p>
  </div>
</div>
  
                     
    <div class="info-panel">
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


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
        <div>
          {/* Productos Patrocinados */}
          <div className="product-carousel">
            <h3>Patrocinado · Productos sugeridos</h3>
            <div className="carousel-container">
              <div className="product">
                <img src="path_to_image1.jpg" alt="Producto 1" />
                <p>adidas - Pantalón corto Real Madrid</p>
                <span>59,99 €</span>
              </div>
              <div className="product">
                <img src="path_to_image2.jpg" alt="Producto 2" />
                <p>adidas - Pantalón corto Real Madrid</p>
                <span>43,99 €</span>
              </div>
              <div className="product">
                <img src="path_to_image3.jpg" alt="Producto 3" />
                <p>adidas Originals Pantalón Corto Real Madrid</p>
                <span>45,00 €</span>
              </div>
              <div className="product">
                <img src="path_to_image4.jpg" alt="Producto 4" />
                <p>adidas Pantalón Real Madrid Authentic</p>
                <span>50,00 €</span>
              </div>
            </div>
          </div>
      
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
          </div>
      
          {/* Panel izquierdo con videos */}
          <div className="prediction-panel">
            <div className="video-container" onClick={() => window.open('https://www.cupraofficial.es/ofertas/formentor', '_blank')}>
              <iframe
                src="https://www.youtube.com/embed/eUaywO-fq0I?autoplay=1&mute=1&loop=1&playlist=eUaywO-fq0I"
                title="Anuncio promocional 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
            <div className="video-container" onClick={() => window.open('https://www.playstation.com/es-es/', '_blank')}>
              <iframe
                src="https://www.youtube.com/embed/GWiFgSreYKw?autoplay=1&mute=1&loop=1&playlist=GWiFgSreYKw"
                title="Anuncio promocional 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
            <div className="video-container" onClick={() => window.open('https://www.heineken.com/es/es/agegateway?returnurl=%2fes%2fes%2fhome', '_blank')}>
              <iframe
                src="https://www.youtube.com/embed/i0Wtxu5TI6Y?autoplay=1&mute=1&loop=1&playlist=i0Wtxu5TI6Y"
                title="Anuncio promocional 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
          </div>
      
          {/* Panel derecho con video */}
          <div className="info-panel">
            <iframe
              src="https://www.youtube.com/embed/Wbh8HMmU-Gs?autoplay=1&mute=1&loop=1&playlist=Wbh8HMmU-Gs"
              title="Video destacado"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
          </div>
        </div>
      );
      
    

 }
 export default Login;
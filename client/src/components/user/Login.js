import React, { useState } from 'react';
import '../styles/index.css'; // Importa los estilos globales

function Login() {
    const [formData, setFormData] = useState({
        identifier: '', // Puede ser nombre de usuario o correo electrónico
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: formData.identifier,
                    password: formData.password
                })
            });
            if (!response.ok) {
                throw new Error('Error al iniciar sesión. Verifique sus credenciales.');
            }
            setSuccess('Inicio de sesión exitoso');
            // Redirigir a la página de inicio después del inicio de sesión exitoso
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
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
        </div>
    );
}

export default Login;

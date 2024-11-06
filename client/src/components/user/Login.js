import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.css'; // Importa los estilos globales

function Login() {
    const [formData, setFormData] = useState({
        identifier: '', // Puede ser nombre de usuario o correo electrónico
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

            // Guardar el nombre de usuario en localStorage
            //localStorage.setItem('username', formData.identifier);
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

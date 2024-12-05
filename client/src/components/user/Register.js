import React, { useState } from 'react';
import '../../styles/index.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [passwordValidations, setPasswordValidations] = useState({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            validatePassword(value);
        }
    };

    const validatePassword = (password) => {
        setPasswordValidations({
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasMinLength: password.length >= 6
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasMinLength } = passwordValidations;

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !hasMinLength) {
            setError('La contraseña no cumple con los requisitos');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setError('');

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });
            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }
            window.location.href = '/';
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h1>Crear Cuenta en Futbol360</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
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
                <ul className="password-validation-list">
                    <li className={passwordValidations.hasUpperCase ? 'valid' : 'invalid'}>
                        Al menos una letra mayúscula
                    </li>
                    <li className={passwordValidations.hasLowerCase ? 'valid' : 'invalid'}>
                        Al menos una letra minúscula
                    </li>
                    <li className={passwordValidations.hasNumber ? 'valid' : 'invalid'}>
                        Al menos un número
                    </li>
                    <li className={passwordValidations.hasSpecialChar ? 'valid' : 'invalid'}>
                        Al menos un símbolo especial
                    </li>
                    <li className={passwordValidations.hasMinLength ? 'valid' : 'invalid'}>
                        Al menos 6 caracteres
                    </li>
                </ul>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
    );
}

export default Register;

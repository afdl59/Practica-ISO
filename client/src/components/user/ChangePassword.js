import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/user/ChangePassword.css';

function ChangePassword() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!validatePassword(password)) {
            setError('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
            return;
        }

        try {
            const response = await fetch(`/api/users/${username}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword: password }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar la contraseña');
            }

            setSuccess('Contraseña actualizada correctamente');
            setTimeout(() => navigate('/perfil'), 3000);
        } catch (error) {
            setError('Error al cambiar la contraseña');
        }
    };

    return (
        <div className="change-password-container">
            <h2>Cambiar Contraseña</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Nueva Contraseña:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirmar Contraseña:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Actualizar Contraseña</button>
            </form>
        </div>
    );
}

export default ChangePassword;

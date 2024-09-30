import React from 'react';
import '../styles/index.css'; // Importa los estilos globales

function Register() {
    return (
        <div className="auth-container">
            <h1>Crear Cuenta en Futbol360</h1>
            <form action="/api/register" method="POST">
                <input type="text" placeholder="Nombre de Usuario" required />
                <input type="email" placeholder="Correo Electrónico" required />
                <input type="password" placeholder="Contraseña" required />
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
    );
}

export default Register;


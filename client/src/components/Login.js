import React from 'react';
import '../styles/index.css'; // Importa los estilos globales

function Login() {
    return (
        <div className="auth-container">
            <h1>Iniciar Sesión en Futbol360</h1>
            <form action="/api/login" method="POST">
                <input type="email" placeholder="Correo Electrónico" required />
                <input type="password" placeholder="Contraseña" required />
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
    );
}

export default Login;

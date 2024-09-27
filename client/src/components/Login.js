// src/components/Login.js
import React, { useState } from 'react';
import React from 'react';
import './styles/index.css';

function Login() {
  return (
    <div className="auth-container">
      <h1>Iniciar Sesión en Futbol360</h1>
      <form action="/login" method="POST">
        <input type="email" placeholder="Correo Electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;

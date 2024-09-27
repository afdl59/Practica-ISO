// src/components/Register.js
import React, { useState } from 'react';
import '../styles/Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de registro
  };

  return (
    <div className="register-container">
      <h1>Crear Cuenta en Futbol360</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nombre de Usuario:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        
        <label htmlFor="email">Correo Electrónico:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
    </div>
  );
}

export default Register;

// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido a Futbol360</h1>
      <p>Para acceder a todas las funcionalidades de Futbol360, inicia sesión o crea una cuenta.</p>
      <div className="auth-links">
        <Link to="/login" className="btn">Iniciar Sesión</Link>
        <Link to="/register" className="btn">Registrarse</Link>
      </div>
    </div>
  );
}

export default Home;



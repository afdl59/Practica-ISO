import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Video de fondo */}
      <video className="video-background" autoPlay loop muted>
        <source src="/VideoFutbolHome.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Contenido principal */}
      <div className="content-wrapper">
        <h1 className="title">Bienvenido a Futbol360</h1>
        <p className="description">
          Descubre el mundo del fútbol como nunca antes. Inicia sesión o crea una cuenta para acceder a todas las funcionalidades.
        </p>
        <div className="buttons">
          <a href="/login" className="btn">Iniciar Sesión</a>
          <a href="/register" className="btn btn-alt">Registrarse</a>
        </div>
      </div>
    </div>
  );
}

export default Home;



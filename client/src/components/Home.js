import React, { useState, useEffect } from 'react';
import '../styles/Home.css';

function Home() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'medium',
      });
      setCurrentTime(formattedTime);
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">
      {/* Video de fondo */}
      <video className="video-background" autoPlay loop muted>
        <source src="/Balon.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Fecha y hora en tiempo real */}
      <div className="date-time">
        <p>{currentTime}</p>
      </div>

      {/* Contenido principal */}
      <div className="content-wrapper">
        <h1 className="title">Bienvenido a Futbol360</h1>
        <p className="description">
          Descubre el mundo del fútbol como nunca antes. Inicia sesión o crea una cuenta para acceder a todas las funcionalidades.
        </p>
        <div className="buttons">
          <a href="/login" className="btn primary">Iniciar Sesión</a>
          <a href="/register" className="btn secondary">Registrarse</a>
        </div>
      </div>
    </div>
  );
}

export default Home;


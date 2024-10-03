// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="navbar">
      <Link to="/" className="navbar-item">
        <img src="/assets/logo.jpg" alt="Icon Inicio" className="navbar-icon" />
        <h3 className="navbar-title">Inicio</h3>
      </Link>
      <Link to="/login" className="navbar-item">
        <img src="/assets/logo.jpg" alt="Icon Iniciar Sesión" className="navbar-icon" />
        <h3 className="navbar-title">Iniciar Sesión</h3>
      </Link>
      <Link to="/register" className="navbar-item">
        <img src="/assets/logo.jpg" alt="Icon Registrarse" className="navbar-icon" />
        <h3 className="navbar-title">Registrarse</h3>
      </Link>
      <Link to="/partidos" className="navbar-item">
        <img src="/assets/logo.jpg" alt="Icon Partidos" className="navbar-icon" />
        <h3 className="navbar-title">Partidos</h3>
      </Link>

      {/* Sección para los minijuegos */}
      <div className="navbar-item minigames-section">
        <h3 className="navbar-title">Minijuegos</h3>
        <Link to="/guess-the-player" className="navbar-item">
          <img src="/assets/logo.jpg" alt="Icon Guess The Player" className="navbar-icon" />
          <h3 className="navbar-title">Guess the Player</h3>
        </Link>
        <Link to="/tiro-libre" className="navbar-item">
          <img src="/assets/logo.jpg" alt="Icon Tiro Libre" className="navbar-icon" />
          <h3 className="navbar-title">Tiro Libre</h3>
        </Link>
        <Link to="/bingo" className="navbar-item">
          <img src="/assets/logo.jpg" alt="Icon Bingo" className="navbar-icon" />
          <h3 className="navbar-title">Bingo</h3>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;


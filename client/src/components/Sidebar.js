// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="navbar">
      <Link to="/" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Inicio</h3>
      </Link>
      <Link to="/login" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Iniciar Sesión</h3>
      </Link>
      <Link to="/register" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Registrarse</h3>
      </Link>
      <Link to="/partidos" className="navbar-item">
        <img src="/../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Partidos</h3>
      </Link>
      <Link to="/notificaciones" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Notificaciones personalizadas</h3>
      </Link>
      <Link to="/estadisticas" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Estadísticas</h3>
      </Link>
      <Link to="/foro" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Foro</h3>
      </Link>
      <Link to="/minijuegos" className="navbar-item">
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Minijuegos</h3>
      </Link>
      <Link to="/minijuegos/bingo" className="navbar-item"> {/* Enlace al nuevo juego de Bingo */}
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Bingo de Futbolistas</h3>
      </Link>
      <Link to="/tiro-libre" className="navbar-item"> {/* Enlace al juego de Tiro Libre */}
        <img src="../assets/logo.jpg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Tiro Libre</h3>
      </Link>
    </div>
  );
}

export default Sidebar;


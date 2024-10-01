// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="navbar">
      <Link to="/partidos" className="navbar_item">
        <img src="/../assets/logo.jpeg" alt="Icono de seccion" className="navbar-icon" />
        <h3 className="navbar-title">Partidos</h3>
      </Link>
      <Link to="/notificaciones" className="navbar-item">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Notificaciones personalizadas</h3>
      </Link>
      <Link to="/estadisticas" className="navbar-item">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Estadísticas</h3>
      </Link>
      <Link to="/foro" className="navbar-item">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Foro</h3>
      </Link>
      <Link to="/minijuegos" className="navbar-item">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="navbar-icon" />
        <h3 className="navbar-title">Minijuegos</h3>
      </Link>
    </div>
  );
}

export default Sidebar;

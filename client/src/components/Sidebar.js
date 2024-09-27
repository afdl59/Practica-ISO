// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/notificaciones">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="sidebar-icon" />
        <h3 className="sidebar-title">Notificaciones personalizadas</h3>
      </Link>
      <Link to="/estadisticas">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="sidebar-icon" />
        <h3 className="sidebar-title">Estadísticas</h3>
      </Link>
      <Link to="/foro">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="sidebar-icon" />
        <h3 className="sidebar-title">Foro</h3>
      </Link>
      <Link to="/minijuegos">
        <img src="/../assets/logo.jpeg" alt="Icono de sección" className="sidebar-icon" />
        <h3 className="sidebar-title">Minijuegos</h3>
      </Link>
    </div>
  );
}

export default Sidebar;

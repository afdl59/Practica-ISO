// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const [minigamesOpen, setMinigamesOpen] = useState(false);

  const toggleMinigames = () => {
    setMinigamesOpen(!minigamesOpen);
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-item">
        <img src="/assets/icon-inicio.png" alt="Icon Inicio" className="navbar-icon" />
        <h3 className="navbar-title">Inicio</h3>
      </Link>
      <Link to="/perfil" className="navbar-item">
        <img src="/assets/icon-perfil.png" alt="Icon Perfil" className="navbar-icon" />
        <h3 className="navbar-title">Perfil</h3>
      </Link>
      <Link to="/foro" className="navbar-item">
        <img src="/assets/icon-foro.png" alt="Icon Foro" className="navbar-icon" />
        <h3 className="navbar-title">Foro</h3>
      </Link>
      <Link to="/estadisticas" className="navbar-item">
        <img src="/assets/icon-estadisticas.png" alt="Icon Estadísticas" className="navbar-icon" />
        <h3 className="navbar-title">Estadísticas</h3>
      </Link>
      
      <div className="navbar-item dropdown" onClick={toggleMinigames}>
        <img src="/assets/icon-minijuegos.png" alt="Icon Minijuegos" className="navbar-icon" />
        <h3 className="navbar-title">Minijuegos</h3>
        {minigamesOpen && (
          <div className="dropdown-content">
            <Link to="/minijuegos/guess-the-player" className="dropdown-item">Guess the Player</Link>
            <Link to="/minijuegos/tiro-libre" className="dropdown-item">Tiro Libre</Link>
            <Link to="/minijuegos/bingo" className="dropdown-item">Bingo</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import '../styles/Sidebar.css';

function Sidebar() {
  const [minigamesOpen, setMinigamesOpen] = useState(false);

  const toggleMinigames = () => {
    setMinigamesOpen(!minigamesOpen);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link to="/" className="navbar-item">
          <img src={logo} alt="Icon Inicio" className="navbar-icon" />
          <h3 className="navbar-title">Inicio</h3>
        </Link>
        <Link to="/login" className="navbar-item">
          <img src={logo} alt="Icon Perfil" className="navbar-icon" />
          <h3 className="navbar-title">Perfil</h3>
        </Link>
        <Link to="/register" className="navbar-item">
          <img src={logo} alt="Icon Foro" className="navbar-icon" />
          <h3 className="navbar-title">Foro</h3>
        </Link>
        <Link to="/partidos" className="navbar-item">
          <img src={logo} alt="Icon Estadísticas" className="navbar-icon" />
          <h3 className="navbar-title">Estadísticas</h3>
        </Link>
        {/* Minijuegos - Menú desplegable */}
        <div className="navbar-item dropdown" onClick={toggleMinigames}>
          <img src={logo} alt="Icon Minijuegos" className="navbar-icon" />
          <h3 className="navbar-title">Minijuegos</h3>
          {minigamesOpen && (
            <div className="dropdown-content">
              <Link to="/minijuegos/guess-the-player" className="dropdown-item">
                Guess the Player
              </Link>
              <Link to="/minijuegos/tiro-libre" className="dropdown-item">
                Tiro Libre
              </Link>
              <Link to="/minijuegos/bingo" className="dropdown-item">
                Bingo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;



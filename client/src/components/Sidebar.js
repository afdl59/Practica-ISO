import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import '../styles/Sidebar.css';

function Sidebar() {
  const [minigamesOpen, setMinigamesOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [setEquipoFavorito] = useState('');
  const [setIntereses] = useState([]);

  const toggleMinigames = () => {
    setMinigamesOpen(!minigamesOpen);
  };

  useEffect(() => {
    // Cargar equipo e intereses del localStorage
    const savedEquipo = localStorage.getItem('equipoFavorito');
    const savedIntereses = JSON.parse(localStorage.getItem('intereses')) || [];

    setEquipoFavorito(savedEquipo);
    setIntereses(savedIntereses);

    // Generar notificaciones basadas en el equipo e intereses
    const nuevasNotificaciones = [];

    if (savedEquipo) {
      nuevasNotificaciones.push(`Noticias recientes de ${savedEquipo}`);
    }

    savedIntereses.forEach(interes => {
      nuevasNotificaciones.push(`Actualización en ${interes}`);
    });

    setNotificaciones(nuevasNotificaciones);
  }, []);

  return (
    <div className="navbar">
      <Link to="/" className="navbar-item">
        <img src={logo} alt="Icon Inicio" className="navbar-icon" />
        <h3 className="navbar-title">Inicio</h3>
      </Link>
      <Link to="/perfil" className="navbar-item">
        <img src={logo} alt="Icon Perfil" className="navbar-icon" />
        <h3 className="navbar-title">Perfil</h3>
      </Link>
      <Link to="/foro" className="navbar-item">
        <img src={logo} alt="Icon Foro" className="navbar-icon" />
        <h3 className="navbar-title">Foro</h3>
      </Link>
      <Link to="/partidos" className="navbar-item">
        <img src={logo} alt="Icon Estadísticas" className="navbar-icon" />
        <h3 className="navbar-title">Estadísticas</h3>
      </Link>

      <div className="navbar-item dropdown" onClick={toggleMinigames}>
        <img src={logo} alt="Icon Minijuegos" className="navbar-icon" />
        <h3 className="navbar-title">Minijuegos</h3>
        {minigamesOpen && (
          <div className="dropdown-content">
            <Link to="/minijuegos/guess-the-player" className="dropdown-item">Guess the Player</Link>
            <Link to="/minijuegos/tiro-libre" className="dropdown-item">Tiro Libre</Link>
            <Link to="/minijuegos/bingo" className="dropdown-item">Bingo</Link>
            <Link to="/minijuegos/wordle-diario" className="dropdown-item">Wordle Diario</Link>
          </div>
        )}
      </div>

      <div className="navbar-item notifications">
        <h3 className="navbar-title">Notificaciones</h3>
        {notificaciones.length > 0 ? (
          <ul>
            {notificaciones.map((notificacion, index) => (
              <li key={index}>{notificacion}</li>
            ))}
          </ul>
        ) : (
          <p>No tienes notificaciones nuevas</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;


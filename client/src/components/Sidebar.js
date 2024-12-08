import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaComments, FaChartBar, FaGamepad, FaBell } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar() {
  const [minigamesOpen, setMinigamesOpen] = useState(false);
  const [estadisticasOpen, setEstadisticasOpen] = useState(false);

  const toggleMinigames = () => {
    setMinigamesOpen(!minigamesOpen);
  };

  const toggleEstadisticas = () => {
    setEstadisticasOpen(!estadisticasOpen);
  };

  return (
    <div className="navbar-horizontal">
      <Link to="/" className="navbar-item">
        <FaHome className="navbar-icon" />
        <span className="navbar-title">Inicio</span>
      </Link>
      <Link to="/perfil" className="navbar-item">
        <FaUser className="navbar-icon" />
        <span className="navbar-title">Perfil</span>
      </Link>
      <Link to="/foro" className="navbar-item">
        <FaComments className="navbar-icon" />
        <span className="navbar-title">Foro</span>
      </Link>

      {/* Sección Estadísticas */}
      <div className="navbar-item dropdown" onClick={toggleEstadisticas}>
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Estadísticas</span>
        {estadisticasOpen && (
          <div className="dropdown-content">
            <Link to="/partidos" className="dropdown-item">Partidos Pasados</Link>
            <Link to="/partidos-directo" className="dropdown-item">Partidos en Directo</Link>
            <Link to="/proximos-partidos" className="dropdown-item">Próximos Partidos</Link>
          </div>
        )}
      </div>

      {/* Sección Predicciones */}
      <Link to="/predicciones" className="navbar-item">
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Predicciones</span>
      </Link>

      {/* Sección Minijuegos */}
      <div className="navbar-item dropdown" onClick={toggleMinigames}>
        <FaGamepad className="navbar-icon" />
        <span className="navbar-title">Minijuegos</span>
        {minigamesOpen && (
          <div className="dropdown-content">
            <Link to="/minijuegos/guess-the-player" className="dropdown-item">Guess the Player</Link>
            <Link to="/minijuegos/tiro-libre" className="dropdown-item">Tiro Libre</Link>
            <Link to="/minijuegos/bingo" className="dropdown-item">Bingo</Link>
            <Link to="/minijuegos/wordle-diario" className="dropdown-item">Wordle Diario</Link>
          </div>
        )}
      </div>

      {/* Sección Rankings */}
      <Link to="/leaderboard" className="navbar-item">
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Rankings</span>
      </Link>

      {/* Sección Notificaciones */}
      <Link to="/notificaciones" className="navbar-item">
        <FaBell className="navbar-icon" />
        <span className="navbar-title">Notificaciones</span>
      </Link>
      
    </div>
  );
}

export default Sidebar;

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
    <div className="navbar">
      <Link to="/" className="navbar-item">
        <img src={FaHome} alt="Icon Inicio" className="navbar-icon" />
        <h3 className="navbar-title">Inicio</h3>
      </Link>
      <Link to="/perfil" className="navbar-item">
        <img src={FaUser} alt="Icon Perfil" className="navbar-icon" />
        <h3 className="navbar-title">Perfil</h3>
      </Link>
      <Link to="/foro" className="navbar-item">
        <img src={FaComments} alt="Icon Foro" className="navbar-icon" />
        <h3 className="navbar-title">Foro</h3>
      </Link>

      {/* Nueva sección Estadísticas */}
      <div className="navbar-item dropdown" onClick={toggleEstadisticas}>
        <img src={FaChartBar} alt="Icon Estadísticas" className="navbar-icon" />
        <h3 className="navbar-title">Estadísticas</h3>
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
        <img src={FaChartBar} alt="Icon Foro" className="navbar-icon" />
        <h3 className="navbar-title">Predicciones</h3>
      </Link>

      {/* Sección Minijuegos */}
      <div className="navbar-item dropdown" onClick={toggleMinigames}>
        <img src={FaGamepad} alt="Icon Minijuegos" className="navbar-icon" />
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

      {/* Sección Notificaciones */}
      <Link to="/notificaciones" className="navbar-item">
        <img src={FaBell} alt="Icon Notificaciones" className="navbar-icon" />
        <h3 className="navbar-title">Notificaciones</h3>
      </Link>
      
    </div>
  );
}

export default Sidebar;

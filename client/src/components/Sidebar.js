import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaComments, FaChartBar, FaGamepad, FaBell } from 'react-icons/fa';
import '../styles/Sidebar.css';
/*comntario*/
function Sidebar() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const savedEquipo = localStorage.getItem('equipoFavorito');
    const savedIntereses = JSON.parse(localStorage.getItem('intereses')) || [];

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
      <Link to="/estadisticas" className="navbar-item">
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Estadísticas</span>
      </Link>
      <Link to="/predicciones" className="navbar-item">
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Predicciones</span>
      </Link>
      <Link to="/minijuegos" className="navbar-item">
        <FaGamepad className="navbar-icon" />
        <span className="navbar-title">Minijuegos</span>
      </Link>
      <div className="navbar-item notifications">
        <FaBell className="navbar-icon" />
        <span className="navbar-title">Notificaciones</span>
        {notificaciones.length > 0 ? (
          <ul className="notification-list">
            {notificaciones.map((notificacion, index) => (
              <li key={index}>{notificacion}</li>
            ))}
          </ul>
        ) : (
          <p className="notification-text">No tienes notificaciones nuevas</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;


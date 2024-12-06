import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaComments, FaChartBar, FaGamepad, FaBell, FaArchive, FaShoppingCart, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="navbar-horizontal">
      {/* Inicio */}
      <Link to="/" className="navbar-item">
        <FaHome className="navbar-icon" />
        <span className="navbar-title">Inicio</span>
      </Link>

      {/* Perfil */}
      <Link to="/perfil" className="navbar-item">
        <FaUser className="navbar-icon" />
        <span className="navbar-title">Perfil</span>
      </Link>

      {/* Foro */}
      <Link to="/foro" className="navbar-item">
        <FaComments className="navbar-icon" />
        <span className="navbar-title">Foro</span>
      </Link>

      {/* Estadísticas */}
      <Link to="/estadisticas" className="navbar-item">
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Estadísticas</span>
      </Link>

      {/* Predicciones */}
      <Link to="/predicciones" className="navbar-item">
        <FaChartBar className="navbar-icon" />
        <span className="navbar-title">Predicciones</span>
      </Link>

      {/* Minijuegos */}
      <Link to="/minijuegos" className="navbar-item">
        <FaGamepad className="navbar-icon" />
        <span className="navbar-title">Minijuegos</span>
      </Link>

      {/* Archivo */}
      <Link to="/archivo" className="navbar-item">
        <FaArchive className="navbar-icon" />
        <span className="navbar-title">Archivo</span>
      </Link>

      {/* Historial de Ventas */}
      <Link to="/ventas" className="navbar-item">
        <FaShoppingCart className="navbar-icon" />
        <span className="navbar-title">Historial de Ventas</span>
      </Link>

      {/* Añadir Cuenta */}
      <Link to="/cuenta" className="navbar-item">
        <FaPlusCircle className="navbar-icon" />
        <span className="navbar-title">Añadir Cuenta</span>
      </Link>

      {/* Cerrar Sesión */}
      <Link to="/cerrar-sesion" className="navbar-item">
        <FaSignOutAlt className="navbar-icon" />
        <span className="navbar-title">Cerrar Sesión</span>
      </Link>

      {/* Notificaciones */}
      <div className="navbar-item notifications">
        <FaBell className="navbar-icon" />
        <span className="navbar-title">Notificaciones</span>
        <ul className="notification-list">
          <li>No tienes notificaciones nuevas</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

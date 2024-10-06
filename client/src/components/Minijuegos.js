// src/components/Minijuegos.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Minijuegos.css'; // Asegúrate de tener estilos para el componente

function Minijuegos() {
  return (
    <div className="minijuegos-container">
      <h1>Minijuegos</h1>
      <p>¡Elige un minijuego para jugar!</p>
      <div className="minijuegos-list">
      <Link to="/GuessThePlayer" className="minijuego-item">
          <h2>Tiro Libre</h2>
          <p>Demuestra tu habilidad con los tiros libres.</p>
        </Link>
        <Link to="/TiroLibre" className="minijuego-item">
          <h2>Tiro Libre</h2>
          <p>Demuestra tu habilidad con los tiros libres.</p>
        </Link>
        <Link to="/PlayerSelector" className="minijuego-item">
          <h2>Tiro Libre</h2>
          <p>Demuestra tu habilidad con los tiros libres.</p>
        </Link>
        <Link to="/Bingo" className="minijuego-item">
          <h2>Bingo de Futbolistas</h2>
          <p>¡Rellena las casillas con futbolistas conocidos!</p>
        </Link>
      </div>
    </div>
  );
}

export default Minijuegos;



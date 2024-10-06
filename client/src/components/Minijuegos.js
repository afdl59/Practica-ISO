// src/components/Minijuegos.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Minijuegos.css'; 

function Minijuegos() {
  return (
    <div className="minijuegos-container">
      <h1>Minijuegos</h1>
      <p>¡Elige un minijuego para jugar!</p>
      <div className="minijuegos-list">
        <Link to="/minijuegos/guess-the-player" className="minijuego-item">
          <h2>Guess The Player</h2>
          <p>Adivina el futbolista con pistas visuales.</p>
        </Link>
        <Link to="/minijuegos/tiro-libre" className="minijuego-item">
          <h2>Tiro Libre</h2>
          <p>Demuestra tu habilidad con los tiros libres.</p>
        </Link>
        <Link to="/minijuegos/player-selector" className="minijuego-item">
          <h2>Player Selector</h2>
          <p>Selecciona jugadores para tu equipo ideal.</p>
        </Link>
        <Link to="/minijuegos/bingo" className="minijuego-item">
          <h2>Bingo de Futbolistas</h2>
          <p>¡Rellena las casillas con futbolistas conocidos!</p>
        </Link>
      </div>
    </div>
  );
}

export default Minijuegos;




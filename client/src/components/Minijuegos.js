// src/components/Minijuegos.js
import React from 'react';
import '../styles/Minijuegos.css';
import { Link } from 'react-router-dom';

function Minijuegos() {
  return (
    <div className="minijuegos-container">
      <h1>Minijuegos de Futbol360</h1>
      <ul>
      <li><Link to="/tiro-libre">Tiro Libre</Link></li>
        <li><a href="/minijuego2">Penaltis</a></li>
        <li><a href="/minijuego3">Cabeza de Oro</a></li>
        <li><a href="/minijuego4">Fútbol de Mesa</a></li>
      </ul>
    </div>
  );
}

export default Minijuegos;

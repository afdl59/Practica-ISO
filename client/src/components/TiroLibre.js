// src/components/TiroLibre.js
import React, { useState } from 'react';
import './TiroLibre.css'; // Asegúrate de tener estilos para el componente

const TiroLibre = () => {
  const [goles, setGoles] = useState(0);
  const [resultado, setResultado] = useState('');
  
  const porteroPosicion = {
    left: `${Math.random() * 70 + 15}%`, // Random position within the goal
    top: '30%' // Fixed vertical position
  };

  const realizarTiro = () => {
    const gol = Math.random() > 0.5; // 50% de probabilidad de marcar un gol
    if (gol) {
      setGoles(goles + 1);
      setResultado('¡Gol!');
    } else {
      setResultado('¡Fallaste!');
    }
  };

  return (
    <div className="tiro-libre-container">
      <h1>Tiro Libre</h1>
      <div className="campo">
        <div className="portero" style={porteroPosicion}></div>
      </div>
      <button onClick={realizarTiro}>Chutar</button>
      <h2>Goles: {goles}</h2>
      {resultado && <h3>{resultado}</h3>}
    </div>
  );
};

export default TiroLibre;


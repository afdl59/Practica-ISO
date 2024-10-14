import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

// Importar las imágenes directamente
import falcao2012 from '../assets/falcao2012.jpg';
import cristiano2012 from '../assets/cristiano2012.jpg';
import messi2012 from '../assets/messi2012.jpg';
import griezmann2016 from '../assets/griezmann2016.jpg';
import ferran2022 from '../assets/ferran2022.jpg';

// Mapeo de jugadores con probabilidades y rutas de imágenes
const players = {
  falcao: { leftNear: 0.9, leftFar: 0.7, rightNear: 0.6, rightFar: 0.4, image: falcao2012 },
  cristiano: { leftNear: 0.95, leftFar: 0.95, rightNear: 0.95, rightFar: 0.95, image: cristiano2012 },
  messi: { leftNear: 0.9, leftFar: 0.85, rightNear: 0.9, rightFar: 0.85, image: messi2012 },
  griezmann: { leftNear: 0.6, leftFar: 0.8, rightNear: 0.8, rightFar: 0.9, image: griezmann2016 },
  ferran: { leftNear: 0.4, leftFar: 0.3, rightNear: 0.3, rightFar: 0.2, image: ferran2022 },
};

const sides = ['left', 'right'];
const distances = ['near', 'far'];

function TiroLibre() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState('');

  const shoot = () => {
    if (!selectedPlayer) return;

    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    const randomDistance = distances[Math.floor(Math.random() * distances.length)];

    const successProbability = players[selectedPlayer][`${randomSide}${randomDistance.charAt(0).toUpperCase() + randomDistance.slice(1)}`];
    const isGoal = Math.random() < successProbability;

    setResult(isGoal ? '¡Gol!' : '¡Parada de Casillas!');
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>
      <div className="players">
        {Object.keys(players).map((player) => (
          <button key={player} onClick={() => setSelectedPlayer(player)}>
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>
      <button onClick={shoot} className="shoot-btn">Lanzar</button>
      <div className="result">{result}</div>
    </div>
  );
}

export default TiroLibre;



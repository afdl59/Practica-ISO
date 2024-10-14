import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

const players = {
  falcao: { leftNear: 0.9, leftFar: 0.7, rightNear: 0.6, rightFar: 0.4, image: 'falcao2012.jpg' },
  cristiano: { leftNear: 0.95, leftFar: 0.95, rightNear: 0.95, rightFar: 0.95, image: 'cristiano2012.jpg' },
  messi: { leftNear: 0.9, leftFar: 0.85, rightNear: 0.9, rightFar: 0.85, image: 'messi2012.jpg' },
  griezmann: { leftNear: 0.6, leftFar: 0.8, rightNear: 0.8, rightFar: 0.9, image: 'griezmann2016.jpg' },
  ferran: { leftNear: 0.4, leftFar: 0.3, rightNear: 0.3, rightFar: 0.2, image: 'ferran2022.jpg' },
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
            <img src={require(`../assets/${players[player].image}`)} alt={player} />
          </button>
        ))}
      </div>
      <button onClick={shoot} className="shoot-btn">Lanzar</button>
      <div className="result">{result}</div>
    </div>
  );
}

export default TiroLibre;




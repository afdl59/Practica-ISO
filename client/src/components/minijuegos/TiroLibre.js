import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

// Importar imágenes
import falcao2012 from '../../assets/falcao2012.jpg';
import cristiano2012 from '../../assets/cristiano2012.jpg';
import messi2012 from '../../assets/messi2012.jpg';
import griezmann2016 from '../../assets/griezmann2016.jpg';
import ferran2022 from '../../assets/ferran2022.jpg';
import casillas2012 from '../../assets/casillas2012.jpg';
import soccerBall from '../../assets/ball.png';  // Imagen del balón

// Mapeo de jugadores con probabilidades y rutas de imágenes
const players = {
  falcao: { leftNear: 0.9, leftFar: 0.7, rightNear: 0.6, rightFar: 0.4, image: falcao2012 },
  cristiano: { leftNear: 0.95, leftFar: 0.95, rightNear: 0.95, rightFar: 0.95, image: cristiano2012 },
  messi: { leftNear: 0.9, leftFar: 0.85, rightNear: 0.9, rightFar: 0.85, image: messi2012 },
  griezmann: { leftNear: 0.6, leftFar: 0.8, rightNear: 0.8, rightFar: 0.9, image: griezmann2016 },
  ferran: { leftNear: 0.4, leftFar: 0.3, rightNear: 0.3, rightFar: 0.2, image: ferran2022 }
};

const sides = ['left', 'right'];
const distances = ['near', 'far'];

function TiroLibre() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState('');
  const [goals, setGoals] = useState(0);
  const [misses, setMisses] = useState(0);
  const [ballPosition, setBallPosition] = useState({ side: '', distance: '' });

  useEffect(() => {
    // Inicializar la posición del balón
    generateBallPosition();
  }, []);

  const generateBallPosition = () => {
    // Generar lado y distancia aleatorios
    const side = sides[Math.floor(Math.random() * sides.length)];
    const distance = distances[Math.floor(Math.random() * distances.length)];
    setBallPosition({ side, distance });
  };

  const shoot = () => {
    if (!selectedPlayer) return;

    setResult('');

    setTimeout(() => {
      const { side, distance } = ballPosition;
      const successProbability = players[selectedPlayer][`${side}${distance.charAt(0).toUpperCase() + distance.slice(1)}`];
      const isGoal = Math.random() < successProbability;

      if (isGoal) {
        setGoals(goals + 1);
        setResult('¡Gol!');
      } else {
        setMisses(misses + 1);
        setResult('¡Parada de Casillas!');
      }

      // Regenerar la posición del balón
      generateBallPosition();
    }, 1000);
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>

      {/* Mostrar la posición actual del balón */}
      <div className="ball-position-info">
        <p>Posición del balón: {ballPosition.side === 'left' ? 'Izquierda' : 'Derecha'}, {ballPosition.distance === 'near' ? 'Cerca' : 'Lejos'}</p>
      </div>

      {/* Campo y portería */}
      <div className="field">
        <img src={casillas2012} alt="casillas" className="goalkeeper" />
        <div className={`ball ${ballPosition.side}-${ballPosition.distance}`}></div>
      </div>

      {/* Mostrar los jugadores */}
      <div className="players">
        {Object.keys(players).map((player) => (
          <button key={player} onClick={() => setSelectedPlayer(player)}>
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>

      <button onClick={shoot} className="shoot-btn">Lanzar</button>

      {/* Contadores */}
      <div className="scoreboard">
        <p>Goles: {goals}</p>
        <p>Fallos: {misses}</p>
      </div>

      {/* Resultado del tiro */}
      <div className="result">{result}</div>
    </div>
  );
}

export default TiroLibre;




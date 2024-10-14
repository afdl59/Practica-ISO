import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

// Imágenes de los jugadores
import falcao2012 from '../../assets/falcao2012.jpg';
import cristiano2012 from '../../assets/cristiano2012.jpg';
import messi2012 from '../../assets/messi2012.jpg';
import griezmann2016 from '../../assets/griezmann2016.jpg';
import ferran2022 from '../../assets/ferran2022.jpg';

// Mapeo de jugadores con probabilidades y rutas de imágenes
const players = {
  falcao: { leftNear: 0.9, leftFar: 0.7, rightNear: 0.6, rightFar: 0.4, image: falcao2012 },
  cristiano: { leftNear: 0.95, leftFar: 0.95, rightNear: 0.95, rightFar: 0.95, image: cristiano2012 },
  messi: { leftNear: 0.9, leftFar: 0.85, rightNear: 0.9, rightFar: 0.85, image: messi2012 },
  griezmann: { leftNear: 0.6, leftFar: 0.8, rightNear: 0.8, rightFar: 0.9, image: griezmann2016 },
  ferran: { leftNear: 0.4, leftFar: 0.3, rightNear: 0.3, rightFar: 0.2, image: ferran2022 }
};

const sides = ['izquierda', 'derecha'];
const distances = ['cerca', 'lejos'];

function TiroLibre() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState('');
  const [side, setSide] = useState('');
  const [distance, setDistance] = useState('');
  const [ballPosition, setBallPosition] = useState({ x: 250, y: 150 });
  const [shooting, setShooting] = useState(false);
  const [power, setPower] = useState(50); // Potencia del disparo
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 }); // Posición seleccionada para disparar

  // Genera aleatoriamente el lado y la distancia
  useEffect(() => {
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    const randomDistance = distances[Math.floor(Math.random() * distances.length)];
    setSide(randomSide);
    setDistance(randomDistance);

    const newBallPosition = randomSide === 'izquierda'
      ? randomDistance === 'cerca'
        ? { x: 100, y: 200 }
        : { x: 100, y: 100 }
      : randomDistance === 'cerca'
      ? { x: 300, y: 200 }
      : { x: 300, y: 100 };
    setBallPosition(newBallPosition);
  }, []);

  const handleGoalClick = (e) => {
    // Calcula las coordenadas relativas a todo el campo de juego
    const field = e.target.getBoundingClientRect();
    const x = e.clientX - field.left;
    const y = e.clientY - field.top;

    // Limita la posición del balón a que no salga del área del campo (500px ancho x 300px alto)
    const limitedX = Math.min(Math.max(x, 0), 500);
    const limitedY = Math.min(Math.max(y, 0), 300);

    setTargetPosition({ x: limitedX, y: limitedY });
  };

  const shoot = () => {
    if (!selectedPlayer) return;

    // Calcula la probabilidad inicial según el lado y la distancia
    const baseSuccessProbability = players[selectedPlayer][`${side}${distance.charAt(0).toUpperCase() + distance.slice(1)}`];

    // Ajusta la probabilidad por la potencia del tiro
    const adjustedSuccessProbability = Math.min(baseSuccessProbability + (power / 100), 1);  // Asegura que la probabilidad no sea mayor a 1

    // Determina si es un gol o no
    const isGoal = Math.random() < adjustedSuccessProbability;

    setResult(isGoal ? '¡Gol!' : '¡Parada de Casillas!');

    setShooting(true);
    setTimeout(() => {
      setShooting(false);
    }, 1000);
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>

      <div className="info">
        <p>El tiro será desde el lado: <strong>{side}</strong></p>
        <p>La distancia es: <strong>{distance}</strong></p>
      </div>

      <div className="players">
        {Object.keys(players).map((player) => (
          <button
            key={player}
            className={selectedPlayer === player ? 'selected' : ''}
            onClick={() => setSelectedPlayer(player)}
          >
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>

      <div className="power-bar">
        <label htmlFor="power">Potencia del disparo: {power}</label>
        <input
          id="power"
          type="range"
          min="1"
          max="100"
          value={power}
          onChange={(e) => setPower(e.target.value)}
        />
      </div>

      <button onClick={shoot} className="shoot-btn">Lanzar</button>
      <div className="result">{result}</div>

      <div className="field" onClick={handleGoalClick}>
        {/* Balón: se mueve a la posición seleccionada */}
        <div className={`ball ${shooting ? 'shooting' : ''}`}
          style={{ left: `${targetPosition.x}px`, top: `${targetPosition.y}px` }}>
          ⚽
        </div>

        {/* Portero (Casillas): Se mueve en la portería */}
        <div className="goalkeeper" style={{ left: `calc(50% - 25px)`, top: '70px' }}></div>
      </div>
    </div>
  );
}

export default TiroLibre;











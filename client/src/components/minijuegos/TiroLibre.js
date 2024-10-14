import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

// Importar las imágenes de los jugadores
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

const sides = ['left', 'right'];
const distances = ['near', 'far'];

function TiroLibre() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState('');
  const [side, setSide] = useState('');
  const [distance, setDistance] = useState('');
  const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });
  const [shooting, setShooting] = useState(false);
  const [goalTarget, setGoalTarget] = useState({ x: 250, y: 50 }); // Posición del chute en la portería
  const [power, setPower] = useState(50); // Potencia inicial (0-100)

  // Genera aleatoriamente el lado y la distancia antes de la selección del jugador
  useEffect(() => {
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    const randomDistance = distances[Math.floor(Math.random() * distances.length)];
    setSide(randomSide);

    const newDistance = randomDistance === 'near' ? 20 : 35;
    setDistance(newDistance);

    const newBallPosition = randomSide === 'left'
      ? randomDistance === 'near'
        ? { x: 100, y: 200 }
        : { x: 100, y: 100 }
      : randomDistance === 'near'
      ? { x: 300, y: 200 }
      : { x: 300, y: 100 };
    setBallPosition(newBallPosition);
  }, []);

  // Función para calcular la probabilidad según el lugar de chute y la potencia
  const calculateProbability = (baseProbability) => {
    const { x, y } = goalTarget;
    const centerOffset = Math.abs(x - 250); // Cuanto más cerca del centro, más fácil será marcar
    const verticalOffset = Math.abs(y - 50); // Cuanto más abajo, más fácil para el portero

    let positionFactor = 1 - (centerOffset / 200) * 0.5 - (verticalOffset / 100) * 0.5; // Penaliza tiros alejados del centro
    positionFactor = Math.max(0.5, positionFactor); // Asegura que la penalización nunca sea mayor al 50%

    let powerFactor = 1 - (power / 100) * 0.3; // A mayor potencia, menor precisión
    powerFactor = Math.max(0.7, powerFactor); // No reduce más allá del 30%

    return baseProbability * positionFactor * powerFactor;
  };

  const shoot = () => {
    if (!selectedPlayer) return;

    const baseProbability = players[selectedPlayer][`${side}${distance === 20 ? 'Near' : 'Far'}`];
    const finalProbability = calculateProbability(baseProbability);

    const isGoal = Math.random() < finalProbability;

    setResult(isGoal ? '¡Gol!' : '¡Parada de Casillas!');

    // Mueve el balón con la animación
    setShooting(true);
    setTimeout(() => {
      setShooting(false);
    }, 1000);
  };

  // Función para seleccionar la posición de chute
  const handleGoalClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // X relativa a la portería
    const y = e.clientY - rect.top;  // Y relativa a la portería
    setGoalTarget({ x, y });
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>

      <div className="info">
        <p>El tiro será desde el lado: <strong>{side}</strong></p>
        <p>La distancia es: <strong>{distance} metros</strong></p>
      </div>

      <div className="players">
        {Object.keys(players).map((player) => (
          <button key={player} onClick={() => setSelectedPlayer(player)}>
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>

      {/* Barra de selección de potencia */}
      <div className="power-bar">
        <label className="power-label">Potencia: {power}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={power}
          onChange={(e) => setPower(e.target.value)}
        />
      </div>

      <button onClick={shoot} className="shoot-btn">Lanzar</button>

      <div className="result">{result}</div>

      <div className="field">
        <div className="goal" onClick={handleGoalClick}></div>

        {/* Muestra la posición de la pelota en la portería */}
        <div
          className={`ball ${shooting ? 'shooting' : ''}`}
          style={{
            left: `${goalTarget.x}px`,
            top: `${goalTarget.y}px`,
          }}
        >
          ⚽
        </div>

        <div className="goalkeeper"></div>
      </div>
    </div>
  );
}

export default TiroLibre;







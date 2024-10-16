import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/TiroLibre.css';

import falcao2012 from '../../assets/players/falcao2012.jpg';
import cristiano2012 from '../../assets/players/cristiano2012.jpg';
import messi2012 from '../../assets/players/messi2012.jpg';
import griezmann2016 from '../../assets/players/griezmann2016.jpg';
import ferran2022 from '../../assets/players/ferran2022.jpg';

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
  const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });
  const [shooting, setShooting] = useState(false);
  const [power, setPower] = useState(50); // Potencia del disparo
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 }); // Posición seleccionada en la portería
  const [keeperPosition, setKeeperPosition] = useState({ x: 220, y: 10 }); // Posición inicial del portero

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
    // Calcula las coordenadas relativas a la portería
    const goal = e.target.getBoundingClientRect();
    const x = e.clientX - goal.left;
    const y = e.clientY - goal.top;

    // Limita el balón dentro del área de la portería (200px ancho x 100px alto)
    const limitedX = Math.min(Math.max(x, 0), 200);
    const limitedY = Math.min(Math.max(y, 0), 100);

    setTargetPosition({ x: limitedX, y: limitedY });
  };

  const shoot = () => {
    if (!selectedPlayer) return;

    // Calcula la probabilidad base de éxito según el jugador, la distancia y el lado
    const successProbability = players[selectedPlayer][`${side}${distance.charAt(0).toUpperCase() + distance.slice(1)}`];

    // Ajusta la probabilidad con la potencia (a mayor potencia, más fácil es hacer gol)
    const adjustedProbability = successProbability * (power / 100);

    // Casillas se mueve aleatoriamente a un lado o a otro
    const randomKeeperMovement = Math.random() < 0.5 ? 'left' : 'right'; // Simulación del movimiento de Casillas
    if (randomKeeperMovement === 'left') {
      setKeeperPosition({ x: 180, y: 20 });
    } else {
      setKeeperPosition({ x: 260, y: 20 });
    }

    // Probabilidad ajustada: Si el valor es mayor que un valor aleatorio, es gol; sino es parada
    const isGoal = Math.random() < adjustedProbability;

    // Ahora si el portero está en la dirección correcta (izquierda o derecha), tiene una probabilidad de detener el tiro
    const keeperInterventionProbability = randomKeeperMovement === side ? 0.7 : 0.3; // Casillas tiene más probabilidad de parar si está en el lado correcto

    // Si el portero interviene y la probabilidad de intervención es mayor que la probabilidad ajustada, es una parada
    const isStop = Math.random() < keeperInterventionProbability && !isGoal;

    // Definir el resultado: Si es gol, es gol, si no, Casillas ha parado
    setResult(isStop ? '¡Parada de Casillas!' : '¡Gol!');

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

      <div className="field">
        <div className={`ball ${shooting ? 'shooting' : ''}`}
          style={{ left: `${targetPosition.x + 150}px`, top: `${targetPosition.y}px` }}>
          ⚽
        </div>
        <div className="goal" onClick={handleGoalClick}></div>
        <div className="goalkeeper"
          style={{ left: `${keeperPosition.x}px`, bottom: `${keeperPosition.y}px` }}>
        </div>
      </div>
    </div>
  );
}

export default TiroLibre;














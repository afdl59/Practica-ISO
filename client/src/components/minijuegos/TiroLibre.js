import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

// Importar las imágenes directamente
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
  const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });
  const [power, setPower] = useState(50);  // Potencia del chute
  const [shooting, setShooting] = useState(false);

  const selectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const shoot = () => {
    if (!selectedPlayer) return;

    const successProbability = players[selectedPlayer][`leftNear`]; // Cambia según lado/distance
    const isGoal = Math.random() < successProbability;

    setResult(isGoal ? '¡Gol!' : '¡Parada de Casillas!');
    setShooting(true);

    setTimeout(() => {
      setShooting(false);  // Finalizar la animación del tiro después de 1 segundo
    }, 1000);
  };

  // Mover el balón a donde el usuario haga clic en la portería
  const moveBall = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - 15; // Ajustar para centrar el balón
    const y = e.clientY - rect.top - 15;
    setBallPosition({ x, y });
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>

      {/* Información sobre el chute */}
      <div className="info">
        <p>Selecciona tu jugador, apunta a la portería y ajusta la potencia.</p>
        <p>Potencia: {power}%</p>
      </div>

      {/* Selección de jugadores */}
      <div className="players">
        {Object.keys(players).map((player) => (
          <button
            key={player}
            onClick={() => selectPlayer(player)}
            className={selectedPlayer === player ? 'selected' : ''}
          >
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>

      {/* Ajustar la potencia del chute */}
      <div className="power-bar">
        <input
          type="range"
          min="0"
          max="100"
          value={power}
          onChange={(e) => setPower(e.target.value)}
        />
      </div>

      {/* Botón para lanzar el tiro */}
      <button onClick={shoot} className="shoot-btn">Lanzar</button>

      {/* Mostrar el resultado */}
      <div className="result">{result}</div>

      {/* Campo de juego */}
      <div className="field">
        <div className="goal" onClick={moveBall}></div>

        {/* Balón */}
        <div
          className={`ball ${shooting ? 'shooting' : ''}`}
          style={{ top: `${ballPosition.y}px`, left: `${ballPosition.x}px` }}
        >
          ⚽
        </div>

        {/* Portero */}
        <div className="goalkeeper"></div>
      </div>
    </div>
  );
}

export default TiroLibre;








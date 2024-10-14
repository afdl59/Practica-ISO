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
  const [side, setSide] = useState('');  // Para almacenar el lado (left o right)
  const [distance, setDistance] = useState('');  // Para almacenar la distancia (near o far)
  const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 }); // Posición inicial del balón
  const [shooting, setShooting] = useState(false);  // Para animar el tiro

  // Genera aleatoriamente el lado y la distancia antes de la selección del jugador
  useEffect(() => {
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    const randomDistance = distances[Math.floor(Math.random() * distances.length)];
    setSide(randomSide);
    setDistance(randomDistance);

    // Actualiza la posición del balón en el campo dependiendo de la distancia y lado
    const newBallPosition = randomSide === 'left'
      ? randomDistance === 'near'
        ? { x: 100, y: 200 }
        : { x: 100, y: 100 }
      : randomDistance === 'near'
      ? { x: 300, y: 200 }
      : { x: 300, y: 100 };
    setBallPosition(newBallPosition);
  }, []);  // Ejecutar una vez al montar el componente

  const shoot = () => {
    if (!selectedPlayer) return;

    // Calcula la probabilidad de éxito basada en el jugador, el lado y la distancia
    const successProbability = players[selectedPlayer][`${side}${distance.charAt(0).toUpperCase() + distance.slice(1)}`];
    const isGoal = Math.random() < successProbability;

    setResult(isGoal ? '¡Gol!' : '¡Parada de Casillas!');

    // Mueve el balón con la animación
    setShooting(true);
    setTimeout(() => {
      setShooting(false);  // Detiene la animación del tiro después de un tiempo
    }, 1000);
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>

      {/* Muestra el lado y la distancia antes de que el jugador sea seleccionado */}
      <div className="info">
        <p>El tiro será desde el lado: <strong>{side}</strong></p>
        <p>La distancia es: <strong>{distance}</strong></p>
      </div>

      {/* Selección de jugadores */}
      <div className="players">
        {Object.keys(players).map((player) => (
          <button key={player} onClick={() => setSelectedPlayer(player)}>
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>

      {/* Botón para lanzar el tiro */}
      <button onClick={shoot} className="shoot-btn">Lanzar</button>

      {/* Mostrar el resultado */}
      <div className="result">{result}</div>

      {/* Campo de juego */}
      <div className="field">
        {/* Balón */}
        <div className={`ball ${shooting ? 'shooting' : ''}`} 
          style={{ left: `${ballPosition.x}px`, top: `${ballPosition.y}px` }}>
        </div>

        {/* Portero en movimiento */}
        <div className="goalkeeper"></div>

        {/* Indicaciones visuales para el lado y distancia */}
        <div className={`side-indicator ${side}`}></div>
        <div className={`distance-indicator ${distance}`}></div>
      </div>
    </div>
  );
}

export default TiroLibre;





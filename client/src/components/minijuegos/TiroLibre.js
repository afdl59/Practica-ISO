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

const sides = ['izquierda', 'derecha'];
const distances = ['cerca', 'lejos'];

function TiroLibre() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState('');
  const [side, setSide] = useState('');  
  const [distance, setDistance] = useState('');  
  const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });  
  const [shooting, setShooting] = useState(false);  

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

  const shoot = () => {
    if (!selectedPlayer) return;

    const successProbability = players[selectedPlayer][`${side}${distance === 20 ? 'Near' : 'Far'}`];
    const isGoal = Math.random() < successProbability;

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
        <p>La distancia es: <strong>{distance} metros</strong></p>
      </div>

      <div className="players">
        {Object.keys(players).map((player) => (
          <button key={player} onClick={() => setSelectedPlayer(player)}>
            <img src={players[player].image} alt={player} />
          </button>
        ))}
      </div>

      <button onClick={shoot} className="shoot-btn">Lanzar</button>

      <div className="result">{result}</div>

      <div className="field">
        <div className={`ball ${shooting ? 'shooting' : ''}`} 
          style={{ left: `${ballPosition.x}px`, top: `${ballPosition.y}px` }}>
          ⚽
        </div>

        <div className="goalkeeper"></div>

        <div className={`side-indicator ${side}`}></div>
        <div className={`distance-indicator ${distance === 20 ? 'near' : 'far'}`}></div>
      </div>
    </div>
  );
}

export default TiroLibre;






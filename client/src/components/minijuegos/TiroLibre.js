import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/TiroLibre.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

import falcao2012 from '../../assets/players/falcao2012.jpg';
import cristiano2012 from '../../assets/players/cristiano2012.jpg';
import messi2012 from '../../assets/players/messi2012.jpg';
import griezmann2016 from '../../assets/players/griezmann2016.jpg';
import ferran2022 from '../../assets/players/ferran2022.jpg';

const players = {
  falcao: { leftNear: 0.9, leftFar: 0.7, rightNear: 0.6, rightFar: 0.4, image: falcao2012 },
  cristiano: { leftNear: 0.95, leftFar: 0.95, rightNear: 0.95, rightFar: 0.95, image: cristiano2012 },
  messi: { leftNear: 0.9, leftFar: 0.85, rightNear: 0.9, rightFar: 0.85, image: messi2012 },
  griezmann: { leftNear: 0.6, leftFar: 0.8, rightNear: 0.8, rightFar: 0.9, image: griezmann2016 },
  ferran: { leftNear: 0.4, leftFar: 0.3, rightNear: 0.3, rightFar: 0.2, image: ferran2022 },
};

const sides = ['izquierda', 'derecha'];
const distances = ['cerca', 'lejos'];

function TiroLibre() {
  const { leaderboards, updateLeaderboard } = useLeaderboard();
  const leaderboard = leaderboards['tiroLibre'] || [];

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [side, setSide] = useState('');
  const [distance, setDistance] = useState('');
  const [power, setPower] = useState(50);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    const randomDistance = distances[Math.floor(Math.random() * distances.length)];
    setSide(randomSide);
    setDistance(randomDistance);
  }, []);

  const shoot = () => {
    if (!selectedPlayer) {
      setResult('Selecciona un jugador antes de disparar.');
      return;
    }

    const successProbability = players[selectedPlayer][`${side}${distance.charAt(0).toUpperCase() + distance.slice(1)}`];
    const adjustedProbability = successProbability * (power / 100);

    const isGoal = Math.random() < adjustedProbability;

    if (isGoal) {
      setScore((prev) => prev + 10);
      setResult('¡Gol!');
    } else {
      setResult('¡Fallaste!');
    }

    setAttempts((prev) => prev - 1);

    if (attempts - 1 <= 0) {
      setGameOver(true);
      setResult('¡Fin del juego!');
      updateLeaderboard('tiroLibre', 'Jugador', score);
    }
  };

  const resetGame = () => {
    setSelectedPlayer(null);
    setPower(50);
    setScore(0);
    setAttempts(5);
    setGameOver(false);
    setResult('');
  };

  return (
    <div className="game-container">
      <h1>Tiro Libre</h1>
      <div className="game-section">
        <div className="game-content">
          <div className="info">
            <p>Lado del tiro: <strong>{side}</strong></p>
            <p>Distancia: <strong>{distance}</strong></p>
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
            <label htmlFor="power">Potencia: {power}</label>
            <input
              id="power"
              type="range"
              min="1"
              max="100"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </div>
          <button onClick={shoot} disabled={gameOver}>Lanzar</button>
          <div className="result">{result}</div>
          <h2>Puntuación: {score}</h2>
          <h3>Intentos restantes: {attempts}</h3>
          {gameOver && (
            <div className="game-over">
              <h3>Juego Terminado</h3>
              <p>Tu puntuación final es: {score}</p>
              <button onClick={resetGame}>Reiniciar</button>
            </div>
          )}
        </div>

        <div className="leaderboard-section">
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Jugador</th>
                <th>Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.playerName}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TiroLibre;

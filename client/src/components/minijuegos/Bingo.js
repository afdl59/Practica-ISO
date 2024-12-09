import React, { useState } from 'react';
import '../../styles/minijuegos/Bingo.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

const jugadores = [
  { nombre: "Harry Kane", definicion: "Delantero estrella del Bayern de Múnich y la selección inglesa." },
  { nombre: "Sergio Ramos", definicion: "Defensa central, leyenda del Real Madrid y capitán de la selección española." },
  { nombre: "Cristiano Ronaldo", definicion: "Delantero legendario, ha jugado en varias ligas, incluyendo La Liga y la Premier." },
  { nombre: "Mohamed Salah", definicion: "Delantero egipcio que brilla en la Premier League con el Liverpool." },
  { nombre: "Lionel Messi", definicion: "Considerado uno de los mejores futbolistas de todos los tiempos." },
];

// Función para calcular el puntaje
function calculateBingoScore(inputs) {
  const correctAnswers = inputs.filter((input, index) =>
    input.trim().toLowerCase() === jugadores[index].nombre.toLowerCase()
  ).length;

  const isFullBoard = correctAnswers === jugadores.length;
  return isFullBoard ? correctAnswers + 5 : correctAnswers; // Bonus por completar el tablero
}

function BingoGame() {
  const { leaderboards, updateLeaderboard } = useLeaderboard();
  const leaderboard = leaderboards['bingo'] || [];

  const [inputs, setInputs] = useState(Array(jugadores.length).fill(''));
  const [score, setScore] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const validarGanador = () => {
    const currentScore = calculateBingoScore(inputs);
    setScore(currentScore);

    if (currentScore === jugadores.length + 5) { // Puntaje máximo con bonus
      setMensaje('¡Ganaste! Has completado el bingo.');
    } else if (currentScore > 0) {
      setMensaje('¡Sigue jugando! Estás avanzando.');
    } else {
      setMensaje('Intenta completar más cuadros.');
    }

    // Actualizar leaderboard
    updateLeaderboard('bingo', 'Jugador', currentScore);
  };

  return (
    <div className="bingo-container">
      <h1>Bingo de Futbolistas</h1>
      <div className="game-section">
        <div className="game-content">
          <div className="grid">
            {jugadores.map((jugador, index) => (
              <div
                key={index}
                className={`grid-item ${inputs[index]?.trim().toLowerCase() === jugador.nombre.toLowerCase() ? 'correct' : ''}`}
              >
                <p>{jugador.definicion}</p>
                <input
                  type="text"
                  value={inputs[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onBlur={validarGanador}
                />
              </div>
            ))}
          </div>
          <h2>Puntuación actual: {score}</h2>
          <p>{mensaje}</p>
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

export default BingoGame;

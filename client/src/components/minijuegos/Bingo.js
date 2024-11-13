import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/Bingo.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

const jugadores = [
  { nombre: "Harry Kane", definicion: "Delantero estrella del bayern de munchen y la selección inglesa." },
  { nombre: "Sergio Ramos", definicion: "Defensa central, leyenda del Real Madrid y capitán de la selección española." },
  { nombre: "Cristiano Ronaldo", definicion: "Delantero legendario, ha jugado en varias ligas, incluyendo La Liga y la Premier." },
  { nombre: "Mohamed Salah", definicion: "Delantero egipcio que brilla en la Premier League con el Liverpool." },
  { nombre: "Isco Alarcon", definicion: "Centrocampista español, conocido por su creatividad y juego en el Real Madrid." },
  { nombre: "Francesco Totti", definicion: "Delantero que dedicó toda su carrera a la AS Roma en la Serie A." },
  { nombre: "Antoine Griezmann", definicion: "Delantero que ha jugado en La Liga y la selección francesa." },
  { nombre: "Iker Casillas", definicion: "Portero icónico del Real Madrid y la selección española." },
  { nombre: "Santiago Cazorla", definicion: "Centrocampista con gran visión de juego, ha jugado en La Liga y Premier League." }
];

function calculateBingoScore(inputs, jugadores) {
  // Each correct square gives 1 point, full board gives 1 extra point
  const filledSquares = inputs.filter((input, index) => 
      input.trim().toLowerCase() === jugadores[index].nombre.toLowerCase()
  ).length;
  const isFullBoard = filledSquares === jugadores.length;
  return isFullBoard ? filledSquares + 1 : filledSquares;
}

function BingoGame({ jugadores, playerName }) {
  const { updateLeaderboard } = useLeaderboard();
  const [inputs, setInputs] = useState(Array(jugadores.length).fill(''));
  const [score, setScore] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const handleInputChange = (index, value) => {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);
  };

  const validarGanador = () => {
      const currentScore = calculateBingoScore(inputs, jugadores);
      setScore(currentScore);
      
      if (currentScore === 10) { // Full board score
          setMensaje('¡Ganaste! Has completado el bingo.');
          updateLeaderboard('bingo', playerName, currentScore);
      } else {
          setMensaje(''); // Clear message if not complete
      }
  };

  return (
      <div className="bingo-container">
          <h1>Bingo de Futbolistas</h1>
          <div className="grid">
              {jugadores.map((jugador, index) => (
                  <div key={index} className={`grid-item ${inputs[index].trim().toLowerCase() === jugadores[index].nombre.toLowerCase() ? 'correct' : ''}`}>
                      <p>{jugador.definicion}</p>
                      <input
                          type="text"
                          value={inputs[index]}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onBlur={() => validarGanador()} // Validate when leaving the input
                          onKeyDown={(e) => e.key === 'Enter' && validarGanador()} // Validate on Enter press
                      />
                  </div>
              ))}
          </div>
          {mensaje && <div className="win-message">{mensaje}</div>}
          <h2>Your score: {score}</h2>
      </div>
  );
}

export default BingoGame;
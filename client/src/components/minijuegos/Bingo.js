import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/Bingo.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

// Define los jugadores
const jugadoresDefault = [
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

// Función para calcular el puntaje
function calculateBingoScore(inputs, jugadores) {
  // Validar que jugadores e inputs sean válidos
  if (!Array.isArray(jugadores) || !Array.isArray(inputs)) return 0;

  const filledSquares = inputs.filter((input, index) => 
      input.trim().toLowerCase() === jugadores[index]?.nombre.toLowerCase()
  ).length;

  const isFullBoard = filledSquares === jugadores.length;
  return isFullBoard ? filledSquares + 1 : filledSquares;
}

function BingoGame({ jugadores, playerName }) {
  const { updateLeaderboard } = useLeaderboard();

  // Inicializar estado con un fallback
  const [inputs, setInputs] = useState(() => 
      Array(jugadores?.length || 0).fill('')
  );

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

      if (currentScore === jugadores.length + 1) { // Full board score
          setMensaje('¡Ganaste! Has completado el bingo.');
          updateLeaderboard('bingo', playerName, currentScore);
      } else {
          setMensaje('');
      }
  };

  // Mostrar mensaje si no hay jugadores disponibles
  if (!jugadores || jugadores.length === 0) {
      return <div>No hay datos de jugadores disponibles.</div>;
  }

  return (
      <div className="bingo-container">
          <h1>Bingo de Futbolistas</h1>
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
                          onBlur={() => validarGanador()}
                          onKeyDown={(e) => e.key === 'Enter' && validarGanador()}
                      />
                  </div>
              ))}
          </div>
          {mensaje && <div className="win-message">{mensaje}</div>}
          <h2>Your score: {score}</h2>
      </div>
  );
}

// Props por defecto
BingoGame.defaultProps = {
  jugadores: jugadoresDefault,
  playerName: 'Guest'
};

export default BingoGame;



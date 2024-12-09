import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/Bingo.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

// Datos de los jugadores definidos directamente en el componente
const jugadores = [
  { nombre: "Harry Kane", definicion: "Delantero estrella del Bayern de Múnich y la selección inglesa." },
  { nombre: "Sergio Ramos", definicion: "Defensa central, leyenda del Real Madrid y capitán de la selección española." },
  { nombre: "Cristiano Ronaldo", definicion: "Delantero legendario, ha jugado en varias ligas, incluyendo La Liga y la Premier." },
  { nombre: "Mohamed Salah", definicion: "Delantero egipcio que brilla en la Premier League con el Liverpool." },
  { nombre: "Isco Alarcon", definicion: "Centrocampista español, conocido por su creatividad y juego en el Real Madrid." },
  { nombre: "Francesco Totti", definicion: "Delantero que dedicó toda su carrera a la AS Roma en la Serie A." },
  { nombre: "Antoine Griezmann", definicion: "Delantero que ha jugado en La Liga y la selección francesa." },
  { nombre: "Iker Casillas", definicion: "Portero icónico del Real Madrid y la selección española." },
  { nombre: "Santiago Cazorla", definicion: "Centrocampista con gran visión de juego, ha jugado en La Liga y Premier League." }
];

function calculateBingoScore(inputs) {
  const filledSquares = inputs.filter((input, index) =>
    input.trim().toLowerCase() === jugadores[index].nombre.toLowerCase()
  ).length;

  const isFullBoard = filledSquares === jugadores.length;
  return isFullBoard ? filledSquares + 1 : filledSquares;
}

function BingoGame() {
  const { leaderboards, updateLeaderboard } = useLeaderboard();
  const [inputs, setInputs] = useState(Array(jugadores.length).fill(''));
  const [score, setScore] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const leaderboard = leaderboards['bingo'] || [];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUsername(data.username);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  const validarGanador = async () => {
    const currentScore = calculateBingoScore(inputs);
    setScore(currentScore);

    if (currentScore > 0) {
      if (isAuthenticated) {
        try {
          const response = await fetch(`/api/users/${username}/score`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: 'bingo', newScore: currentScore }),
          });
          if (!response.ok) throw new Error('Error al actualizar la puntuación');
          setMensaje('¡Puntuación guardada!');
        } catch (error) {
          console.error('Error al guardar la puntuación:', error);
          setMensaje('Error al guardar la puntuación.');
        }
      } else {
        setMensaje(`¡Has obtenido ${currentScore} puntos! Inicia sesión para guardar tu puntuación.`);
      }
    } else {
      setMensaje('Aún no has completado ninguna casilla correctamente.');
    }
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

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
  );
}

export default BingoGame;


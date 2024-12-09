import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/TiroLibre.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

import falcao2012 from '../../assets/players/falcao2012.jpg';
import cristiano2012 from '../../assets/players/cristiano2012.jpg';
import messi2012 from '../../assets/players/messi2012.jpg';
import griezmann2016 from '../../assets/players/griezmann2016.jpg';
import ferran2022 from '../../assets/players/ferran2022.jpg';

const players = {
  falcao: { image: falcao2012, skill: 0.85 },
  cristiano: { image: cristiano2012, skill: 0.95 },
  messi: { image: messi2012, skill: 0.90 },
  griezmann: { image: griezmann2016, skill: 0.80 },
  ferran: { image: ferran2022, skill: 0.70 },
};

function TiroLibre() {
  const { leaderboards, updateLeaderboard } = useLeaderboard();
  const leaderboard = leaderboards['tiroLibre'] || [];

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [goalkeeperPosition, setGoalkeeperPosition] = useState({ x: 100, y: 50 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Mover el portero aleatoriamente cada 2 segundos
    const interval = setInterval(() => {
      const randomX = Math.random() * 200;
      const randomY = Math.random() * 100;
      setGoalkeeperPosition({ x: randomX, y: randomY });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Verificar la sesión del usuario
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  const handleGoalClick = async (e) => {
    if (!selectedPlayer) {
      setMessage('Por favor selecciona un jugador antes de disparar.');
      return;
    }

    const goal = e.target.getBoundingClientRect();
    const x = e.clientX - goal.left;
    const y = e.clientY - goal.top;

    setTargetPosition({ x, y });

    // Calcular probabilidad de éxito basada en la habilidad del jugador
    const playerSkill = players[selectedPlayer].skill;
    const isGoal =
      (x > goalkeeperPosition.x + 20 ||
        x < goalkeeperPosition.x - 20 ||
        y > goalkeeperPosition.y + 20 ||
        y < goalkeeperPosition.y - 20) &&
      Math.random() < playerSkill;

    if (isGoal) {
      setScore(score + 10);
      setMessage('¡Gol!');
      if (isAuthenticated) {
        // Enviar la puntuación al servidor
        try {
            const response = await fetch(`/api/users/${username}/score`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: 'tiroLibre', newScore: score }),
            });
            if (!response.ok) throw new Error('Error al actualizar la puntuación');
        } catch (error) {
            console.error(error);
        }
    } else {
        alert(`¡Has obtenido ${calculatedScore} puntos! Inicia sesión para guardar tu puntuación.`);
    }
    } else {
      setMessage('¡Parada del portero!');
    }
  };

  return (
    <div className="tirolibre-container">
      <h1>Tiro Libre</h1>
      <p>{message}</p>
      <h2>Puntuación: {score}</h2>

      {/* Selección de jugadores */}
      <div className="players">
        <h3>Selecciona un jugador:</h3>
        {Object.keys(players).map((player) => (
          <button
            key={player}
            className={selectedPlayer === player ? 'selected' : ''}
            onClick={() => setSelectedPlayer(player)}
          >
            <img src={players[player].image} alt={player} style={{ width: '50px', height: '50px' }} />
          </button>
        ))}
      </div>

      {/* Campo de juego */}
      <div className="field">
        <div
          className="goal"
          onClick={handleGoalClick}
          style={{
            position: 'relative',
            width: '200px',
            height: '100px',
            border: '2px solid black',
          }}
        >
          <div
            className="goalkeeper"
            style={{
              position: 'absolute',
              left: `${goalkeeperPosition.x}px`,
              top: `${goalkeeperPosition.y}px`,
              width: '40px',
              height: '40px',
              backgroundColor: 'blue',
            }}
          />
        </div>
      </div>

      {/* Leaderboard */}
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

export default TiroLibre;

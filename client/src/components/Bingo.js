// src/components/Bingo.js
import React, { useState, useEffect } from 'react';
import '../styles/Bingo.css'; // Asegúrate de tener estilos para el bingo

const Bingo = () => {
  const [grid, setGrid] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winMessage, setWinMessage] = useState(''); // Para almacenar el mensaje de victoria

  // Definiciones correspondientes a cada jugador
  const playerDefinitions = [
    { name: 'Antoine Griezmann', definition: 'Delantero que ha jugado en La Liga y la selección francesa.' },
    { name: 'Isco Alarcon', definition: 'Centrocampista español, conocido por su creatividad y juego en el Real Madrid.' },
    { name: 'Sergio Ramos', definition: 'Defensa central, leyenda del Real Madrid y capitán de la selección española.' },
    { name: 'Santiago Cazorla', definition: 'Centrocampista con gran visión de juego, ha jugado en La Liga y Premier League.' },
    { name: 'Harry Kane', definition: 'Delantero estrella del Tottenham y la selección inglesa.' },
    { name: 'Iker Casillas', definition: 'Portero icónico del Real Madrid y la selección española.' },
    { name: 'Mohamed Salah', definition: 'Delantero egipcio que brilla en la Premier League con el Liverpool.' },
    { name: 'Cristiano Ronaldo', definition: 'Delantero legendario, ha jugado en varias ligas, incluyendo La Liga y la Premier.' },
    { name: 'Francesco Totti', definition: 'Delantero que dedicó toda su carrera a la AS Roma en la Serie A.' }
  ];

  useEffect(() => {
    // Generar una cuadrícula de 9 casillas con definiciones aleatorias
    const shuffledPlayers = playerDefinitions.sort(() => 0.5 - Math.random()).slice(0, 9);
    setGrid(shuffledPlayers);
  }, []);

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.length < 9) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const checkWinCondition = () => {
    if (selectedPlayers.length === 9) {
      // Verificar si todas las selecciones son correctas
      const correctAnswers = playerDefinitions.map(p => p.name);
      const isWinner = selectedPlayers.every(name => correctAnswers.includes(name));
      setIsGameOver(true);
      // Mensaje de victoria
      if (isWinner) {
        setWinMessage("¡No está mal tu conocimiento futbolístico! Pero la próxima vez será más difícil.");
      } else {
        alert("¡Perdiste! Intenta de nuevo.");
      }
    }
  };

  useEffect(() => {
    checkWinCondition();
  }, [selectedPlayers]);

  return (
    <div className="bingo-container">
      <h1>Bingo de Futbolistas</h1>
      <p>Rellena las casillas con los jugadores correspondientes:</p>
      <div className="grid">
        {grid.map((player, index) => (
          <div key={index} className="grid-item" onClick={() => handleSelectPlayer(player.name)}>
            {player.definition}
          </div>
        ))}
      </div>
      <h2>Jugadores seleccionados:</h2>
      <div className="selected-players">
        {selectedPlayers.map((name, index) => (
          <span key={index} className="selected-player">{name}</span>
        ))}
      </div>
      {isGameOver && <div className="win-message">{winMessage}</div>}
      {isGameOver && <button onClick={() => window.location.reload()}>Reiniciar Juego</button>}
    </div>
  );
};

export default Bingo;

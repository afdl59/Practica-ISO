import React, { useState, useEffect } from 'react';
import '../styles/Bingo.css';

const Bingo = () => {
  const [grid, setGrid] = useState([]);
  const [playerInputs, setPlayerInputs] = useState(Array(9).fill('')); // Para almacenar las entradas de los jugadores
  const [isCorrect, setIsCorrect] = useState(Array(9).fill(false)); // Para marcar si la entrada es correcta
  const [isGameOver, setIsGameOver] = useState(false);
  const [winMessage, setWinMessage] = useState('');

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

  const handleInputChange = (index, value) => {
    const updatedInputs = [...playerInputs];
    updatedInputs[index] = value; // Actualizar la entrada del jugador en la cuadrícula
    setPlayerInputs(updatedInputs);

    // Verificar si la entrada es correcta cuando se completa
    if (value.toLowerCase() === grid[index].name.toLowerCase()) {
      const updatedCorrect = [...isCorrect];
      updatedCorrect[index] = true; // Marcar la respuesta como correcta
      setIsCorrect(updatedCorrect);
    } else {
      const updatedCorrect = [...isCorrect];
      updatedCorrect[index] = false; // Marcar como incorrecta
      setIsCorrect(updatedCorrect);
    }
  };

  const checkWinCondition = () => {
    const allFilled = playerInputs.every(input => input.length > 0); // Verificar que todas las celdas estén llenas
    if (allFilled) {
      const allCorrect = isCorrect.every(correct => correct); // Verificar que todas las respuestas sean correctas
      setIsGameOver(true);
      if (allCorrect) {
        setWinMessage("¡Felicidades! Has completado el Bingo de Futbolistas correctamente.");
      } else {
        setWinMessage("Algunas respuestas no son correctas. ¡Intenta de nuevo!");
      }
    }
  };

  useEffect(() => {
    checkWinCondition(); // Solo se llama cuando todas las casillas están llenas
  }, [playerInputs]);

  return (
    <div className="bingo-container">
      <h1>Bingo de Futbolistas</h1>
      <p>Rellena las casillas con los jugadores correspondientes:</p>
      <div className="grid">
        {grid.map((player, index) => (
          <div key={index} className={`grid-item ${isCorrect[index] ? 'correct' : ''}`}>
            <p>{player.definition}</p>
            <input
              type="text"
              placeholder="Escribe el nombre del jugador"
              value={playerInputs[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      {isGameOver && <div className="win-message">{winMessage}</div>}
      {isGameOver && <button onClick={() => window.location.reload()}>Reiniciar Juego</button>}
    </div>
  );
};

export default Bingo;


import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/GuessThePlayer.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

import Messi from '../../assets/players/Messi.jpg';
import Cristiano from '../../assets/players/Cristiano.jpg';
import Neymar from '../../assets/players/Neymar.jpg';

const jugadores = [
  { nombres: ['Cristiano Ronaldo', 'Cristiano', 'Ronaldo'], imagen: Cristiano },
  { nombres: ['Lionel Messi', 'Messi'], imagen: Messi },
  { nombres: ['Neymar Jr', 'Neymar'], imagen: Neymar },
];

function calculateScore(attemptsLeft) {
  return attemptsLeft * 5; // Cada intento restante vale 5 puntos
}

function GuessThePlayer() {
  const { leaderboards, updateLeaderboard } = useLeaderboard();
  const leaderboard = leaderboards['guessThePlayer'] || [];

  const [jugadorActual, setJugadorActual] = useState(jugadores[Math.floor(Math.random() * jugadores.length)]);
  const [intento, setIntento] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [imagenBlur, setImagenBlur] = useState(10);
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [score, setScore] = useState(null);

  useEffect(() => {
    setIntento('');
    setMensaje('');
    setImagenBlur(10);
    setAttemptsLeft(6);
    setScore(null);
  }, [jugadorActual]);

  const handleIntento = () => {
    const intentoLowerCase = intento.trim().toLowerCase();
    const esCorrecto = jugadorActual.nombres.some((nombre) => nombre.toLowerCase() === intentoLowerCase);

    if (esCorrecto) {
      const calculatedScore = calculateScore(attemptsLeft);
      setScore(calculatedScore);
      setMensaje('¡Correcto! Has adivinado el jugador.');

      // Actualizar Leaderboard
      updateLeaderboard('guessThePlayer', 'Jugador', calculatedScore);
    } else {
      setAttemptsLeft((prev) => prev - 1);
      setImagenBlur((prev) => Math.max(prev - 2, 0));
      setMensaje(attemptsLeft > 1 ? 'Incorrecto. Intenta de nuevo.' : 'Se acabaron los intentos.');
    }
    setIntento('');
  };

  const siguienteJugador = () => {
    setJugadorActual(jugadores[Math.floor(Math.random() * jugadores.length)]);
  };

  return (
    <div className="guess-container">
      <h1>Guess the Player</h1>
      <div className="game-section">
        <div className="game-content">
          <p>Adivina quién es el jugador en la imagen. Tienes 6 intentos.</p>
          <div className="image-container">
            <img src={jugadorActual.imagen} alt="Football Player" style={{ filter: `blur(${imagenBlur}px)` }} />
          </div>
          {score === null ? (
            <div>
              <input
                type="text"
                placeholder="Introduce el nombre del jugador"
                value={intento}
                onChange={(e) => setIntento(e.target.value)}
              />
              <button onClick={handleIntento}>Adivinar</button>
            </div>
          ) : (
            <button onClick={siguienteJugador}>Siguiente Jugador</button>
          )}
          <p>{mensaje}</p>
          {score !== null && <h2>Puntuación: {score}</h2>}
          <h3>Intentos restantes: {attemptsLeft}</h3>
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

export default GuessThePlayer;

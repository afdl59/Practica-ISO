import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/GuessThePlayer.css';
import { useLeaderboard } from './LeaderboardContext';

import Messi from '../../assets/players/Messi.jpg';
import Cristiano from '../../assets/players/Cristiano.jpg';
import Neymar from '../../assets/players/Neymar.jpg';

const jugadores = [
  { nombres: ['Cristiano Ronaldo', 'Cristiano', 'Ronaldo'], imagen: Cristiano },
  { nombres: ['Lionel Messi', 'Messi'], imagen: Messi },
  { nombres: ['Neymar Jr', 'Neymar'], imagen: Neymar },
];

function calculateGuessThePlayerScore(attempts) {
    return Math.max(5 - attempts + 1, 0);
}

function GuessThePlayer({ playerName }) {
    const { updateLeaderboard } = useLeaderboard();
    const [jugadorActual, setJugadorActual] = useState(jugadores[Math.floor(Math.random() * jugadores.length)]);
    const [intento, setIntento] = useState('');
    const [pista, setPista] = useState(0);
    const [mensaje, setMensaje] = useState('');
    const [imagenBlur, setImagenBlur] = useState(10);
    const [attempts, setAttempts] = useState(0);
    const [score, setScore] = useState(null);

    const handleIntento = (e) => {
        e.preventDefault();
        const intentoLowerCase = intento.toLowerCase();
        const esCorrecto = jugadorActual.nombres.some((nombre) =>
            nombre.toLowerCase() === intentoLowerCase
        );

        if (esCorrecto) {
            const calculatedScore = calculateGuessThePlayerScore(attempts);
            setScore(calculatedScore);
            setMensaje('¡Correcto! Has adivinado el jugador.');
            updateLeaderboard('guessThePlayer', playerName, calculatedScore);
        } else {
            setMensaje('Incorrecto. Intenta de nuevo.');
            setPista(pista + 1);
            setImagenBlur(Math.max(imagenBlur - 2, 0));
            setAttempts(attempts + 1);
        }
        setIntento('');
    };

    const siguienteJugador = () => {
        setJugadorActual(jugadores[Math.floor(Math.random() * jugadores.length)]);
        setPista(0);
        setMensaje('');
        setImagenBlur(10);
        setAttempts(0);
        setScore(null);
    };

    return (
        <div className="guess-container">
            <h1>Guess the Player</h1>
            <p>Try to guess the football player based on the blurred image.</p>
            <div className="image-container">
                <img
                    src={jugadorActual.imagen}
                    alt="Football Player"
                    style={{ filter: `blur(${imagenBlur}px)` }}
                />
            </div>
            <form onSubmit={handleIntento}>
                <input
                    type="text"
                    placeholder="Enter the player's name"
                    value={intento}
                    onChange={(e) => setIntento(e.target.value)}
                    required
                />
                <button type="submit">Guess</button>
            </form>
            <p>{mensaje}</p>
            {score !== null && <h2>Your score: {score}</h2>}
            <button onClick={siguienteJugador}>Next Player</button>
        </div>
    );
}

export default GuessThePlayer;

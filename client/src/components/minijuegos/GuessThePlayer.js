// src/components/GuessThePlayer.js
import React, { useState } from 'react';
import '../../styles/GuessThePlayer.css';

import Messi from '../assets/players/Messi.jpg';
import Cristiano from '../assets/players/Cristiano.jpg';
import Neymar from '../assets/players/Neymar.jpg';

const jugadores = [
  {
    nombres: ['Cristiano Ronaldo', 'Cristiano', 'Ronaldo'],
    imagen: Cristiano,
  },
  {
    nombres: ['Lionel Messi', 'Messi'],
    imagen: Messi,
  },
  {
    nombres: ['Neymar Jr', 'Neymar'],
    imagen: Neymar,
  },
  // Añade más jugadores según sea necesario
];

function GuessThePlayer() {
  const [jugadorActual, setJugadorActual] = useState(jugadores[Math.floor(Math.random() * jugadores.length)]);
  const [intento, setIntento] = useState('');
  const [pista, setPista] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [imagenBlur, setImagenBlur] = useState(10); // Nivel de blur inicial

  const handleIntento = (e) => {
    e.preventDefault();
    const intentoLowerCase = intento.toLowerCase();
    const esCorrecto = jugadorActual.nombres.some((nombre) =>
      nombre.toLowerCase() === intentoLowerCase
    );
    
    if (esCorrecto) {
      setMensaje('¡Correcto! Has adivinado el jugador.');
    } else {
      setMensaje('Incorrecto. Intenta de nuevo.');
      setPista(pista + 1);
      setImagenBlur(imagenBlur - 2); // Reducimos el blur en cada intento incorrecto
    }
    setIntento('');
  };

  const siguienteJugador = () => {
    setJugadorActual(jugadores[Math.floor(Math.random() * jugadores.length)]);
    setPista(0);
    setMensaje('');
    setImagenBlur(10); // Restablecemos el nivel de blur
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
      <button onClick={siguienteJugador}>Next Player</button>
    </div>
  );
}

export default GuessThePlayer;
import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/Bingo.css';

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

const Bingo = () => {
  const [inputs, setInputs] = useState(Array(jugadores.length).fill(""));
  const [mensaje, setMensaje] = useState("");

  // Maneja el cambio de cada input en la cuadrícula
  const handleInputChange = (index, value) => {
    const nuevosInputs = [...inputs];
    nuevosInputs[index] = value;
    setInputs(nuevosInputs);
    setMensaje(""); // Resetear el mensaje mientras se escribe
  };

  // Validar si todos los inputs son correctos
  const validarGanador = () => {
    const esGanador = inputs.every(
      (input, index) => input.trim().toLowerCase() === jugadores[index].nombre.toLowerCase()
    );
    if (esGanador) {
      setMensaje("¡Has ganado!");
    } else {
      setMensaje(""); // No mostrar mensaje hasta que se completen todas las casillas correctamente
    }
  };

  // Maneja el evento cuando se da Enter o se cambia el foco en el último input
  const handleEnterPress = (index) => {
    if (index === jugadores.length - 1) {
      validarGanador(); // Solo validar cuando se complete el último input
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
              onBlur={() => validarGanador()} // Validar al salir del input
              onKeyDown={(e) => e.key === 'Enter' && handleEnterPress(index)} // Validar al presionar Enter en el último input
            />
          </div>
        ))}
      </div>
      {mensaje && <div className="win-message">{mensaje}</div>}
    </div>
  );
};

export default Bingo;


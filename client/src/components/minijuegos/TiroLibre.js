import React, { useState, useEffect } from 'react';
import '../../styles/TiroLibre.css';

const TiroLibre = () => {
  const [ballPosition, setBallPosition] = useState({ top: 400, left: 300 });
  const [goalkeeperPosition, setGoalkeeperPosition] = useState(250);
  const [isShooting, setIsShooting] = useState(false);
  const [goals, setGoals] = useState(0);
  const [misses, setMisses] = useState(0);
  const [shotDirection, setShotDirection] = useState(0); // 0 es centro, -1 izquierda, 1 derecha

  // Mover al portero de lado a lado
  useEffect(() => {
    const moveGoalkeeper = setInterval(() => {
      const newGoalkeeperPosition = Math.random() * (500 - 100) + 100; // Posición aleatoria del portero dentro de los postes
      setGoalkeeperPosition(newGoalkeeperPosition);
    }, 1500); // Cambia la posición cada 1.5 segundos

    return () => clearInterval(moveGoalkeeper);
  }, []);

  // Control del disparo
  const handleShoot = (direction) => {
    setShotDirection(direction);  // -1 izquierda, 0 centro, 1 derecha
    setIsShooting(true);

    setTimeout(() => {
      checkIfGoal(direction);
      setIsShooting(false);
    }, 1000);  // Animación del disparo tarda 1 segundo
  };

  const checkIfGoal = (direction) => {
    const shotPosition = ballPosition.left + direction * 100;
    if (shotPosition > goalkeeperPosition - 50 && shotPosition < goalkeeperPosition + 50) {
      // El portero ataja el balón
      setMisses(misses + 1);
      alert('¡El portero atajó el disparo!');
    } else {
      // El balón entra en el arco
      setGoals(goals + 1);
      alert('¡Gol!');
    }
  };

  return (
    <div className="tiro-libre-containe">
      <h1>Tiro Libre</h1>
      <div className="scoreboard">
        <p>Goles: {goals}</p>
        <p>Fallos: {misses}</p>
      </div>

      <div className="field">
        <div
          className="goalkeeper"
          style={{ left: `${goalkeeperPosition}px` }}
        >
          🧤
        </div>

        <div
          className="ball"
          style={{ top: `${ballPosition.top}px`, left: `${ballPosition.left}px` }}
        >
          ⚽
        </div>
      </div>

      <div className="controls">
        <button onClick={() => handleShoot(-1)}>Disparar Izquierda</button>
        <button onClick={() => handleShoot(0)}>Disparar Centro</button>
        <button onClick={() => handleShoot(1)}>Disparar Derecha</button>
      </div>
    </div>
  );
};

export default TiroLibre;




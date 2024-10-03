// src/components/TiroLibre.js
import React, { useState } from 'react';

function TiroLibre() {
  const [angulo, setAngulo] = useState(0);
  const [potencia, setPotencia] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para calcular el resultado del tiro
    alert(`Tiro realizado con ángulo: ${angulo}° y potencia: ${potencia}`);
  };

  return (
    <div className="tiro-libre-container">
      <h1>Tiro Libre</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Ángulo (0-90°):
          <input type="number" value={angulo} onChange={(e) => setAngulo(e.target.value)} min="0" max="90" />
        </label>
        <br />
        <label>
          Potencia (1-100):
          <input type="number" value={potencia} onChange={(e) => setPotencia(e.target.value)} min="1" max="100" />
        </label>
        <br />
        <button type="submit">Tirar</button>
      </form>
    </div>
  );
}

export default TiroLibre;

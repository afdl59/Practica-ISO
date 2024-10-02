import React from 'react';

function Matches() {
  return (
    <div className="partidos-container">
      <h1>Partidos de Fútbol</h1>
      <p>Aquí encontrarás la información sobre los partidos más recientes y próximos.</p>

      <div className="search-container">
        <input type="text" placeHolder="Buscar partido" className="search-input"/>
        <button className="search-button">
            <i className="fas fa-search">Buscar</i>
        </button>
      </div>
    </div>
  );
}

export default Matches;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Partidos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Para redireccionar a la página de detalles

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/partidos?home_club=${searchTerm}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error al buscar partidos:', error);
    }
  };

  // Función para manejar el clic en un partido
  const handlePartidoClick = (game_id) => {
    // Redirigir al usuario a la página de detalles del partido, pasando el game_id en la URL
    navigate(`/partido/${game_id}`);
  };

  return (
    <div className="partidos-container">
      <h1>Partidos de Fútbol</h1>
      <p>Aquí encontrarás la información sobre los partidos más recientes y próximos.</p>
      
      {/* Campo de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar partido por equipo local..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Mostrar resultados de búsqueda */}
      <ul className="results-list">
        {results.map((partido) => (
          <li key={partido.game_id} onClick={() => handlePartidoClick(partido.game_id)}>
            {partido.home_club_name} vs {partido.away_club_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Partidos;

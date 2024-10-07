import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Partidos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Para redireccionar a la página de detalles

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/partidos?equipo_local=${searchTerm}`);
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

      <ul>
        <li>
          <Link to="/partido-prueba1">Final Champions 2018: Real Madrid vs Liverpool</Link>
        </li>
        <li>
          <Link to="/partido-prueba2">Final Mundial 2010: España vs Holanda</Link>
        </li>
      </ul>
    </div>
  );
}

export default Partidos;

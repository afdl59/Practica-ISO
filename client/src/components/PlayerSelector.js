// src/components/PlayerSelector.js
import React, { useState } from 'react';

const PlayerSelector = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Lógica para filtrar jugadores basado en el término de búsqueda
    const fetchFilteredPlayers = async () => {
      const response = await fetch(`/api/players?search=${searchTerm}`); // API para buscar jugadores
      const data = await response.json();
      setFilteredPlayers(data);
    };

    fetchFilteredPlayers();
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar jugador..." />
      <ul>
        {filteredPlayers.map((player) => (
          <li key={player.id} onClick={() => onSelect(player)}>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerSelector;

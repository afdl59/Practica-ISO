// src/context/FavoritosContext.js
import React, { createContext, useState } from 'react';

export const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [equiposFavoritos, setEquiposFavoritos] = useState([]);
  const [competicionesFavoritas, setCompeticionesFavoritas] = useState([]);

  const addEquipoFavorito = (equipo) => {
    setEquiposFavoritos((prevEquipos) => [...prevEquipos, equipo]);
  };

  const addCompeticionFavorita = (competicion) => {
    setCompeticionesFavoritas((prevCompeticiones) => [...prevCompeticiones, competicion]);
  };

  return (
    <FavoritosContext.Provider
      value={{
        equiposFavoritos,
        competicionesFavoritas,
        addEquipoFavorito,
        addCompeticionFavorita,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

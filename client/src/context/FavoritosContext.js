// src/context/FavoritosContext.js
import React, { createContext, useState } from 'react';

export const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [equiposFavoritos, setEquiposFavoritos] = useState([]);
  const [competicionesFavoritas, setCompeticionesFavoritas] = useState([]);

  const addEquipoFavorito = (equipo) => {
    setEquiposFavoritos((prevEquipos) => {
      if (!prevEquipos.includes(equipo)) {
        const updatedEquipos = [...prevEquipos, equipo];
        console.log("Equipos favoritos actualizados:", updatedEquipos);
        return updatedEquipos;
      }
      return prevEquipos;
    });
  };

  const addCompeticionFavorita = (competicion) => {
    setCompeticionesFavoritas((prevCompeticiones) => {
      if (!prevCompeticiones.includes(competicion)) {
        return [...prevCompeticiones, competicion];
      }
      return prevCompeticiones;
    });
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

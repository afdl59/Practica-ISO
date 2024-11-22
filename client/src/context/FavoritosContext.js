// src/context/FavoritosContext.js
import React, { createContext, useState } from 'react';

export const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [equiposFavoritos, setEquiposFavoritos] = useState([]);
  const [competicionesFavoritas, setCompeticionesFavoritas] = useState([]);

  const addEquipoFavorito = async (equipo) => {
    setEquiposFavoritos((prevEquipos) => {
      if (!prevEquipos.includes(equipo)) {
        const updatedEquipos = [...prevEquipos, equipo];
        console.log("Equipos favoritos actualizados:", updatedEquipos);
  
        // Sincronizar con el backend
        fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ equipoFavorito: updatedEquipos })
        }).catch((err) => console.error('Error al sincronizar equipos favoritos:', err));
  
        return updatedEquipos;
      }
      return prevEquipos;
    });
  };

  const addCompeticionFavorita = (competicion) => {
    setCompeticionesFavoritas((prevCompeticiones) => {
      if (!prevCompeticiones.includes(competicion)) {
        const updatedCompeticiones = [...prevCompeticiones, competicion];
        console.log("Competiciones favoritas actualizadas:", updatedCompeticiones);

        //Sincronizar con el backend
        fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ competicionesFavoritas: updatedCompeticiones })
        }).catch((err) => console.error('Error al sincronizar competiciones favoritas:', err));
        
        return updatedCompeticiones;
      }
      return prevCompeticiones;
    });
  };

  return (
    <FavoritosContext.Provider
      value={{
        equiposFavoritos,
        setEquiposFavoritos,
        competicionesFavoritas,
        setCompeticionesFavoritas,
        addEquipoFavorito,
        addCompeticionFavorita,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

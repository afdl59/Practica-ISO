import React, { createContext, useState } from 'react';

export const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [equiposFavoritos, setEquiposFavoritos] = useState([]);
  const [competicionesFavoritas, setCompeticionesFavoritas] = useState([]);

  const addEquipoFavorito = async (equipo) => {
    if (!equiposFavoritos.includes(equipo)) {
      const updatedEquipos = [...equiposFavoritos, equipo];
      setEquiposFavoritos(updatedEquipos);

      try {
        // Obtener el username del usuario
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();
        const username = data.username;

        // Sincronizar con el backend
        await fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ equipoFavorito: updatedEquipos }),
        });
      } catch (err) {
        console.error('Error al sincronizar equipos favoritos:', err);
      }
    }
  };

  const addCompeticionFavorita = async (competicion) => {
    if (!competicionesFavoritas.includes(competicion)) {
      const updatedCompeticiones = [...competicionesFavoritas, competicion];
      setCompeticionesFavoritas(updatedCompeticiones);

      try {
        // Obtener el username del usuario
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();
        const username = data.username;

        // Sincronizar con el backend
        await fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ competicionesFavoritas: updatedCompeticiones }),
        });
      } catch (err) {
        console.error('Error al sincronizar competiciones favoritas:', err);
      }
    }
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

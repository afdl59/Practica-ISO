import React, { useEffect, useContext } from 'react';
import { FavoritosContext } from '../../context/FavoritosContext';

const LoadInitialFavorites = ({ userData }) => {
  const { setEquiposFavoritos, setCompeticionesFavoritas } = useContext(FavoritosContext);

  useEffect(() => {
    if (userData) {
      setEquiposFavoritos((prev) => prev.length === 0 ? userData.equipoFavorito || [] : prev);
      setCompeticionesFavoritas((prev) => prev.length === 0 ? userData.competicionesFavoritas || [] : prev);
    }
  }, [userData, setEquiposFavoritos, setCompeticionesFavoritas]);  

  return null; // Este componente no renderiza nada en la interfaz
};

export default LoadInitialFavorites;

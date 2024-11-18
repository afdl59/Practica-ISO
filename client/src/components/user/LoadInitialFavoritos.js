import React, { useEffect, useContext } from 'react';
import { FavoritosContext } from '../../context/FavoritosContext';

const LoadInitialFavorites = ({ userData }) => {
  const { setEquiposFavoritos, setCompeticionesFavoritas } = useContext(FavoritosContext);

  useEffect(() => {
    if (userData) {
      setEquiposFavoritos(userData.equipoFavorito || []);
      setCompeticionesFavoritas(userData.competicionesFavoritas || []);
    }
  }, [userData, setEquiposFavoritos, setCompeticionesFavoritas]);

  return null; // Este componente no renderiza nada en la interfaz
};

export default LoadInitialFavorites;

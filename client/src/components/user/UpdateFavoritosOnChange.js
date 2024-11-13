import React, { useEffect, useContext } from 'react';
import { FavoritosContext } from '../../context/FavoritosContext';

const UpdateFavoritesOnChange = ({ setEditedData }) => {
  const { equiposFavoritos, competicionesFavoritas } = useContext(FavoritosContext);

  useEffect(() => {
    setEditedData((prevData) => ({
      ...prevData,
      equipoFavorito: equiposFavoritos,
      competicionesFavoritas: competicionesFavoritas,
    }));
  }, [equiposFavoritos, competicionesFavoritas, setEditedData]);

  return null; // Este componente no renderiza nada en la interfaz
};

export default UpdateFavoritesOnChange;

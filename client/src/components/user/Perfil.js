import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FavoritosContext } from '../../context/FavoritosContext';
import '../../styles/user/Perfil.css';

function Perfil() {
  const navigate = useNavigate();
  const { equiposFavoritos, setEquiposFavoritos, competicionesFavoritas, setCompeticionesFavoritas } = useContext(FavoritosContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    fotoPerfil: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();
        if (!data.isAuthenticated) {
          navigate('/login');
          return;
        }
        const userResponse = await fetch(`/api/users/${data.username}`);
        if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');

        const userData = await userResponse.json();
        setUserData(userData);
        setEditedData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          fotoPerfil: userData.fotoPerfil
        });

        // Cargar favoritos en el contexto
        setEquiposFavoritos(userData.equipoFavorito || []);
        setCompeticionesFavoritas(userData.competicionesFavoritas || []);
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, setEquiposFavoritos, setCompeticionesFavoritas]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', { method: 'POST' });
      if (response.ok) navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && userData) {
      const formData = new FormData();
      formData.append('fotoPerfil', file);
      formData.append('username', userData.username);
      try {
        const response = await fetch('/api/users/uploads', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Error al subir la imagen');
        const data = await response.json();
        setUserData((prevUserData) => ({
          ...prevUserData,
          fotoPerfil: data.imageUrl
        }));
        alert('Imagen subida correctamente');
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        equipoFavorito: [...equiposFavoritos],
        competicionesFavoritas: [...competicionesFavoritas]
      };
  
      console.log("Datos actualizados para guardar:", updatedData);
  
      const response = await fetch(`/api/users/${userData.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json(); // Añadir para ver el resultado
      console.log("Resultado del backend:", result);
  
      if (!response.ok) throw new Error('Error al actualizar los datos del usuario');
  
      setUserData(updatedData);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };
  
  
  if (loading) return <div>Cargando...</div>;
  if (!userData) return <div>Error al cargar los datos del usuario.</div>;

  return (
    <div className="perfil-container">
      <h1>Perfil de {userData.username}</h1>
      <div className="perfil-photo">
        {editedData.fotoPerfil ? (
          <img src={editedData.fotoPerfil} alt="Foto de perfil" className="profile-image" />
        ) : (
          <div className="placeholder-image">No profile photo</div>
        )}
        <input type="file" accept="image/*" onChange={handleFotoChange} />
      </div>

      <div className="perfil-info">
        <label>Nombre:
          <input type="text" name="firstName" value={editedData.firstName} onChange={handleInputChange} />
        </label>
        <label>Apellido:
          <input type="text" name="lastName" value={editedData.lastName} onChange={handleInputChange} />
        </label>
      </div>

      <div className="favoritos">
        <h3>Equipos Favoritos</h3>
        <ul>
          {equiposFavoritos.map((equipo, index) => (
            <li key={`${equipo}-${index}`}>{equipo}</li>
          ))}
        </ul>
        <Link to="/perfil/anadir-equipo-favorito">
          <button>Añadir equipo favorito</button>
        </Link>

        <h3>Competiciones Favoritas</h3>
        <ul>
          {competicionesFavoritas.map((competicion, index) => (
            <li key={`${competicion}-${index}`}>{competicion}</li>
          ))}
        </ul>
        <Link to="/perfil/anadir-competicion-favorita">
          <button>Añadir competición favorita</button>
        </Link>
      </div>

      <button onClick={handleSaveChanges}>Guardar Cambios</button>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Perfil;

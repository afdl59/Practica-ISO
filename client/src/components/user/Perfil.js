import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/Perfil.css';

function Perfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    equipoFavorito: '',
    fotoPerfil: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-session');
        const data = await response.json();

        if (!data.isAuthenticated) {
          navigate('/login');
          return;
        }

        const userResponse = await fetch(`/api/users/${data.username}`);
        if (!userResponse.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const userData = await userResponse.json();
        setUserData(userData);
        setEditedData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          equipoFavorito: userData.equipoFavorito,
          fotoPerfil: userData.fotoPerfil,
        });
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST'
      });

      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({ ...editedData, fotoPerfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/users/${userData.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUserData(updatedUserData);
        alert('Datos actualizados correctamente');
      } else {
        throw new Error('Error al actualizar los datos del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      alert('Hubo un error al actualizar los datos.');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!userData) {
    return <div>Error al cargar los datos del usuario.</div>;
  }

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
        <label>
          Nombre:
          <input
            type="text"
            name="firstName"
            value={editedData.firstName}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Apellido:
          <input
            type="text"
            name="lastName"
            value={editedData.lastName}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Equipo Favorito:
          <input
            type="text"
            name="equipoFavorito"
            value={editedData.equipoFavorito}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="ultimo-login">
        <p>Último inicio de sesión: {userData.ultimoLogin || 'Nunca'}</p>
      </div>

      <button onClick={handleSaveChanges}>Guardar Cambios</button>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Perfil;

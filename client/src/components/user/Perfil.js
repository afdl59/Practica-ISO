import React, { useState, useEffect } from 'react';
import '../../styles/user/Perfil.css';

function Perfil() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [ultimoLogin, setUltimoLogin] = useState('');
  const [equipoFavorito, setEquipoFavorito] = useState('');
  const [intereses, setIntereses] = useState([]);

  const equipos = ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Juventus'];
  const posiblesIntereses = ['Partidos', 'Fichajes', 'Estadísticas', 'Noticias'];

  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const response = await fetch(`/api/users/${username}`);
          if (response.ok) {
            const data = await response.json();
            setNombre(data.firstName);
            setApellido(data.lastName);
            setFotoPerfil(data.fotoPerfil);
            setEquipoFavorito(data.equipoFavorito);
            setIntereses(data.intereses);
            setUltimoLogin(data.ultimoLogin || 'Nunca');
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleNombreChange = (e) => setNombre(e.target.value);
  const handleApellidoChange = (e) => setApellido(e.target.value);
  const handleEquipoChange = (e) => setEquipoFavorito(e.target.value);

  const handleInteresChange = (interes) => {
    if (intereses.includes(interes)) {
      setIntereses(intereses.filter((i) => i !== interes));
    } else {
      setIntereses([...intereses, interes]);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualizar = () => {
    const username = localStorage.getItem('username');
    if (username) {
      const userData = {
        firstName: nombre,
        lastName: apellido,
        fotoPerfil,
        equipoFavorito,
        intereses,
        ultimoLogin: new Date().toLocaleString(),
      };

      fetch(`/api/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then(() => {
          localStorage.setItem('nombre', nombre);
          localStorage.setItem('apellido', apellido);
          localStorage.setItem('fotoPerfil', fotoPerfil);
          localStorage.setItem('equipoFavorito', equipoFavorito);
          localStorage.setItem('intereses', JSON.stringify(intereses));
          setUltimoLogin(userData.ultimoLogin);
          alert('Datos actualizados correctamente');
        })
        .catch((error) => {
          console.error('Error al actualizar los datos del usuario:', error);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="perfil-container">
      <h1>Perfil</h1>
      <div className="perfil-photo">
        {fotoPerfil ? (
          <img src={fotoPerfil} alt="Foto de perfil" className="profile-image" />
        ) : (
          <div className="placeholder-image">No profile photo</div>
        )}
        <input type="file" accept="image/*" onChange={handleFotoChange} />
      </div>

      <div className="perfil-info">
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={handleNombreChange} />
        </label>

        <label>
          Apellido:
          <input type="text" value={apellido} onChange={handleApellidoChange} />
        </label>

        <label>
          Equipo Favorito:
          <select value={equipoFavorito} onChange={handleEquipoChange}>
            <option value="">Selecciona un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo} value={equipo}>
                {equipo}
              </option>
            ))}
          </select>
        </label>

        <label>
          Intereses:
          <div>
            {posiblesIntereses.map((interes) => (
              <div key={interes}>
                <input
                  type="checkbox"
                  checked={intereses.includes(interes)}
                  onChange={() => handleInteresChange(interes)}
                />
                {interes}
              </div>
            ))}
          </div>
        </label>

        <button onClick={handleActualizar}>Actualizar</button>
      </div>

      <div className="ultimo-login">
        <p>Último inicio de sesión: {ultimoLogin}</p>
      </div>

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Perfil;

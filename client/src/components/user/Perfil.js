import React, { useState, useEffect } from 'react';
import '../../styles/user/Perfil.css';

function Perfil() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [ultimoLogin, setUltimoLogin] = useState('');

  // Cargar los datos del usuario desde localStorage cuando el componente se monte
  useEffect(() => {
    const savedNombre = localStorage.getItem('nombre');
    const savedApellido = localStorage.getItem('apellido');
    const savedFoto = localStorage.getItem('fotoPerfil');
    const savedLogin = localStorage.getItem('ultimoLogin');
    
    if (savedNombre) setNombre(savedNombre);
    if (savedApellido) setApellido(savedApellido);
    if (savedFoto) setFotoPerfil(savedFoto);
    if (savedLogin) setUltimoLogin(savedLogin);
  }, []);

  const handleNombreChange = (e) => setNombre(e.target.value);
  const handleApellidoChange = (e) => setApellido(e.target.value);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result); // Guardamos la imagen en formato base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualizar = () => {
    // Guardar los datos actualizados en localStorage
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('apellido', apellido);
    if (fotoPerfil) localStorage.setItem('fotoPerfil', fotoPerfil);

    // Actualizar la fecha del último login
    const loginFecha = new Date().toLocaleString();
    localStorage.setItem('ultimoLogin', loginFecha);
    setUltimoLogin(loginFecha);

    alert('Datos actualizados correctamente');
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

        <button onClick={handleActualizar}>Actualizar</button>
      </div>

      <div className="ultimo-login">
        <p>Último inicio de sesión: {ultimoLogin ? ultimoLogin : 'Nunca'}</p>
      </div>
    </div>
  );
}

export default Perfil;


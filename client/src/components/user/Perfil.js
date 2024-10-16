import React, { useState, useEffect } from 'react';
import '../../styles/user/Perfil.css';

function Perfil() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [ultimoLogin, setUltimoLogin] = useState('');
  const [equipoFavorito, setEquipoFavorito] = useState('');  // Nuevo estado
  const [intereses, setIntereses] = useState([]);             // Nuevo estado para los intereses

  // Equipos de fútbol para que el usuario elija
  const equipos = ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Juventus'];

  // Intereses relacionados al fútbol
  const posiblesIntereses = ['Partidos', 'Fichajes', 'Estadísticas', 'Noticias'];

  useEffect(() => {
    const savedNombre = localStorage.getItem('nombre');
    const savedApellido = localStorage.getItem('apellido');
    const savedFoto = localStorage.getItem('fotoPerfil');
    const savedLogin = localStorage.getItem('ultimoLogin');
    const savedEquipo = localStorage.getItem('equipoFavorito');
    const savedIntereses = JSON.parse(localStorage.getItem('intereses')) || [];

    if (savedNombre) setNombre(savedNombre);
    if (savedApellido) setApellido(savedApellido);
    if (savedFoto) setFotoPerfil(savedFoto);
    if (savedLogin) setUltimoLogin(savedLogin);
    if (savedEquipo) setEquipoFavorito(savedEquipo);
    if (savedIntereses) setIntereses(savedIntereses);
  }, []);

  const handleNombreChange = (e) => setNombre(e.target.value);
  const handleApellidoChange = (e) => setApellido(e.target.value);
  const handleEquipoChange = (e) => setEquipoFavorito(e.target.value);

  const handleInteresChange = (interes) => {
    if (intereses.includes(interes)) {
      setIntereses(intereses.filter(i => i !== interes));
    } else {
      setIntereses([...intereses, interes]);
    }
  };

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
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('apellido', apellido);
    localStorage.setItem('fotoPerfil', fotoPerfil);
    localStorage.setItem('equipoFavorito', equipoFavorito);
    localStorage.setItem('intereses', JSON.stringify(intereses));

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

        <label>
          Equipo Favorito:
          <select value={equipoFavorito} onChange={handleEquipoChange}>
            <option value="">Selecciona un equipo</option>
            {equipos.map(equipo => (
              <option key={equipo} value={equipo}>{equipo}</option>
            ))}
          </select>
        </label>

        <label>
          Intereses:
          <div>
            {posiblesIntereses.map(interes => (
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
        <p>Último inicio de sesión: {ultimoLogin ? ultimoLogin : 'Nunca'}</p>
      </div>
    </div>
  );
}

export default Perfil;



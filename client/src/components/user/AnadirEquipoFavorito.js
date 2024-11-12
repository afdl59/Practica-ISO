import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/user/BuscadorFavoritos.css';

function AñadirEquipoFavorito() {
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [competicion, setCompeticion] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const competicionIds = { 
    "LaLiga": 140, 
    "Premier League": 39, 
    "Serie A": 135, 
    "Bundesliga": 78, 
    "Ligue 1": 61, 
    "World Cup": 1 
    };
    
  const paises = { 
    "España": "spain", 
    "Inglaterra": "england", 
    "Italia": "italy", 
    "Francia": "france", 
    "Alemania": "germany", 
    "Holanda": "netherlands", 
    "Turquía": "turkey" 
    };

  const handleBuscar = async () => {
    setLoading(true);
    let url = 'https://v3.football.api-sports.io/teams?';
    if (nombre) url += `name=${nombre}`;
    if (pais) url += `&country=${paises[pais]}`;
    if (competicion) url += `&league=${competicionIds[competicion]}&season=2022`;

    try {
      const myHeaders = new Headers();
      myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
      myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

      const response = await fetch(url, { method: 'GET', headers: myHeaders });
      const data = await response.json();
      setEquipos(data.response);
    } catch (error) {
      console.error('Error al buscar equipos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipoClick = (equipo) => {
    console.log('Equipo seleccionado:', equipo.team.name);
    props.addEquipoFavorito(equipo.team.name);
    navigate('/perfil');
  };

  return (
    <div className="buscador-favoritos-container">
      <h1>Añadir Equipo Favorito</h1>
      <label>Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label>País:
        <select value={pais} onChange={(e) => setPais(e.target.value)}>
          <option value="">Nada</option>
          {Object.keys(paises).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <label>Competición:
        <select value={competicion} onChange={(e) => setCompeticion(e.target.value)}>
          <option value="">Nada</option>
          {Object.keys(competicionIds).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <button onClick={handleBuscar}>Buscar</button>
      {loading && <p>Cargando...</p>}
      <ul>
        {equipos.map((equipo) => (
          <li key={equipo.team.id} onClick={() => handleEquipoClick(equipo)}>
            <img src={equipo.team.logo} alt={equipo.team.name} width="50" /> {equipo.team.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AñadirEquipoFavorito;

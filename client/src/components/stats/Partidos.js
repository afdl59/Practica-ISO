import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/stats/Partidos.css';

function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [partidosPerPage] = useState(50); // Mostramos 50 partidos por página
  const navigate = useNavigate();

  // Estados para los filtros
  const [temporada, setTemporada] = useState('');
  const [competicion, setCompeticion] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [error, setError] = useState('');

  // Mapeo de las competiciones y sus ids
  const competicionIds = {
    "UEFA Champions League": 2,
    "UEFA Europa League": 3,
    "LaLiga": 140,
    "Premier League": 39,
    "Serie A": 135,
    "Bundesliga": 78,
    "Ligue 1": 61,
    "Copa del Rey": 143,
    "Eurocopa": 4,
    "World Cup": 1
  };

  // Función para manejar la búsqueda
  const handleBuscar = async () => {
    // Verificar campos obligatorios
    if (!temporada || !competicion) {
      setError('Es obligatorio rellenar los campos de temporada y competición.');
      return;
    }
    setError(''); // Limpiar error si todo está bien
    setLoading(true);

    const idCompeticion = competicionIds[competicion];
    const myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
    myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

    let url = `https://v3.football.api-sports.io/fixtures?league=${idCompeticion}&season=${temporada}`;
    if (fechaDesde) url += `&from=${fechaDesde}`;
    if (fechaHasta) url += `&to=${fechaHasta}`;

    try {
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setPartidos(data.response); // Guardamos los partidos
    } catch (error) {
      console.error('Error al cargar los partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejo del clic en un partido
  const handlePartidoClick = (idPartido) => {
    navigate(`/partido/${idPartido}`);
  };

  // Obtener partidos actuales para la página
  const indexOfLastPartido = currentPage * partidosPerPage;
  const indexOfFirstPartido = indexOfLastPartido - partidosPerPage;
  const currentPartidos = partidos.slice(indexOfFirstPartido, indexOfLastPartido);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="partidos-container">
      <h1>Buscador de Partidos</h1>
      
      {/* Formulario de búsqueda */}
      <div className="buscador">
        <label>Temporada:
          <select value={temporada} onChange={(e) => setTemporada(e.target.value)}>
            <option value="">Nada</option>
            {[...Array(8)].map((_, i) => {
              const year = 2015 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </label>

        <label>Competición:
          <select value={competicion} onChange={(e) => setCompeticion(e.target.value)}>
            <option value="">Nada</option>
            {Object.keys(competicionIds).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>

        <label>Desde (YYYY-MM-DD):
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </label>

        <label>Hasta (YYYY-MM-DD):
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </label>

        <button onClick={handleBuscar}>Buscar</button>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Lista de partidos */}
      {loading ? (
        <h2>Cargando partidos...</h2>
      ) : (
        <>
          <ul>
            {currentPartidos.map(partido => (
              <li key={partido.fixture.id} onClick={() => handlePartidoClick(partido.fixture.id)}>
                <div className="partido">
                  <img src={partido.teams.home.logo} alt={partido.teams.home.name} width="50" />
                  <span>{partido.teams.home.name} {partido.goals.home} - {partido.goals.away} {partido.teams.away.name}</span>
                  <img src={partido.teams.away.logo} alt={partido.teams.away.name} width="50" />
                  <div>{new Date(partido.fixture.date).toLocaleDateString()}</div>
                  <div>Competición: {partido.league.name}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          <div className="pagination">
            {Array.from({ length: Math.ceil(partidos.length / partidosPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Partidos;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [partidosPerPage] = useState(50); // Mostramos 50 partidos por página
  const navigate = useNavigate(); // Para redireccionar a la página de detalles

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
        myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        const response = await fetch("https://v3.football.api-sports.io/fixtures?league=140&season=2022", requestOptions);
        const data = await response.json();
        setPartidos(data.response); // Guardamos los partidos
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los partidos:', error);
        setLoading(false);
      }
    };

    fetchPartidos();
  }, []);

  // Función para manejar el clic en un partido
  const handlePartidoClick = (idPartido) => {
    navigate(`/partido/${idPartido}`); // Redirige a la página de detalles del partido
  };

  // Obtener partidos actuales para la página
  const indexOfLastPartido = currentPage * partidosPerPage;
  const indexOfFirstPartido = indexOfLastPartido - partidosPerPage;
  const currentPartidos = partidos.slice(indexOfFirstPartido, indexOfLastPartido);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <h2>Cargando partidos...</h2>;
  }

  return (
    <div className="partidos-container">
      <h1>Partidos de LaLiga 2022/23</h1>
      
      {/* Lista de partidos */}
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
    </div>
  );
}

export default Partidos;

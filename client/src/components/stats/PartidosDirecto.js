import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/stats/PartidosDirecto.css';

function PartidosDirecto() {
  const [partidosPorCompeticion, setPartidosPorCompeticion] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartidosEnDirecto = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
        myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        const sessionResponse = await fetch('/api/auth/check-session');
        const sessionData = await sessionResponse.json();

        if (!sessionData.isAuthenticated) {
          // Si no hay sesión, obtenemos todos los partidos
          const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", requestOptions);
          const data = await response.json();
          setPartidosPorCompeticion({ Todos: data.response });
        } else {
          const userResponse = await fetch(`/api/users/${sessionData.username}`);
          if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');
          const userData = await userResponse.json();

          const partidosAgrupados = {};
          for (const competicion of userData.competicionesFavoritas) {
            const idLeagueResponse = await fetch(`https://v3.football.api-sports.io/leagues?name=${competicion}`, requestOptions);
            const idLeagueData = await idLeagueResponse.json();
            const competitionId = idLeagueData.response[0].league.id;

            const response = await fetch(`https://v3.football.api-sports.io/fixtures?league=${competitionId}&live=all`, requestOptions);
            const data = await response.json();
            partidosAgrupados[competicion] = data.response;
          }

          setPartidosPorCompeticion(partidosAgrupados);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los partidos en directo:', error);
        setLoading(false);
      }
    };

    fetchPartidosEnDirecto();
  }, []);

  const handlePartidoClick = (idPartido) => {
    navigate(`/partido/${idPartido}`);
  };

  if (loading) {
    return <h2>Cargando partidos en directo...</h2>;
  }

  return (
    <div className="partidos-directo-container">
      <h1>Partidos en Directo</h1>
      {Object.keys(partidosPorCompeticion).map((competicion) => (
        <div key={competicion} className="competicion-section">
          <h2>{competicion}</h2>
          <ul>
            {partidosPorCompeticion[competicion].map((partido) => (
              <li key={partido.fixture.id} onClick={() => handlePartidoClick(partido.fixture.id)}>
                <div className="partido">
                  <img src={partido.teams.home.logo} alt={partido.teams.home.name} width="50" />
                  <span>{partido.teams.home.name} {partido.goals.home} - {partido.goals.away} {partido.teams.away.name}</span>
                  <img src={partido.teams.away.logo} alt={partido.teams.away.name} width="50" />
                  <div>{new Date(partido.fixture.date).toLocaleTimeString()}</div>
                  <div>Competición: {partido.league.name}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PartidosDirecto;

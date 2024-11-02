import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/stats/PartidoDetalle.css';

function PartidoDetalle() {
  const { idPartido } = useParams(); // Obtenemos el id del partido desde la URL
  const [marcador, setMarcador] = useState(null);
  const [estadisticas, setEstadisticas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Manejo de errores

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
        myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        // Cargar datos generales del partido (marcador, estadio, etc...)
        const responseMarcador = await fetch(`https://v3.football.api-sports.io/fixtures?id=${idPartido}`, requestOptions);
        const dataMarcador = await responseMarcador.json();

        if (dataMarcador.response.length > 0){
          setMarcador(dataMarcador.response[0]);
        }

        // Cargar estadísticas
        const responseEstadisticas = await fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${idPartido}`, requestOptions);
        const dataEstadisticas = await responseEstadisticas.json();

        if (dataEstadisticas.response.length > 0) {
          setEstadisticas(dataEstadisticas.response);
        }

        // Cargar eventos
        const responseEventos = await fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${idPartido}`, requestOptions);
        const dataEventos = await responseEventos.json();

        if (dataEventos.response.length > 0) {
          setEventos(dataEventos.response);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles del partido:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [idPartido]);

  if (loading) {
    return <h2>Cargando detalles del partido...</h2>;
  }

  if (error) {
    return <h2>Ocurrió un error al cargar los detalles del partido.</h2>;
  }

  return (
    <div className="partido-detalle-container">
      {/* Marcador y logos */}
      <div className="marcador">
        <img src={marcador.league.logo} alt="Logo Campeonato" className="logo-campeonato" />
        <div className="equipo-local">
          <img src={marcador.teams.home.logo} alt={marcador.teams.home.name} />
          <h2>{marcador.teams.home.name}</h2>
        </div>
        <div className="resultado">
          <h1>{marcador.goals.home} : {marcador.goals.away}</h1>
        </div>
        <div className="equipo-visitante">
          <img src={marcador.teams.away.logo} alt={marcador.teams.away.name} />
          <h2>{marcador.teams.away.name}</h2>
        </div>
      </div>

      {/* Eventos con línea de tiempo */}
      <div className="eventos-container">
        <h2>Eventos</h2>
        <div className="linea-tiempo">
          {eventos.map((evento, index) => (
            <div className={`evento ${evento.team.id === marcador.teams.home.id ? 'local' : 'visitante'}`} key={index}>
              <span>{evento.time.elapsed}'</span>
              <div className="detalles-evento">
                {evento.team.id === marcador.teams.home.id ? (
                  <div>{evento.player.name} - {evento.type} ({evento.detail})</div>
                ) : (
                  <div>{evento.player.name} - {evento.type} ({evento.detail})</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas">
        <h2>Estadísticas</h2>
        <table>
          <thead>
            <tr>
              <th>{marcador.teams.home.name}</th>
              <th></th>
              <th>{marcador.teams.away.name}</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.length > 0 && estadisticas[0].statistics.map((stat, index) => (
              <tr key={index}>
                <td>{stat.value}</td>
                <td>{stat.type}</td>
                <td>{estadisticas[1]?.statistics[index]?.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PartidoDetalle;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/stats/PartidoDetalle.css';

function PartidoDetalle() {
  const { idPartido } = useParams(); // Obtenemos el id del partido desde la URL
  const [estadisticas, setEstadisticas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Para manejar errores

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
      <h1>Detalles del Partido</h1>

      {/* Mostrar estadísticas */}
      <h2>Estadísticas</h2>
      <div className="estadisticas">
        {estadisticas.length > 0 ? (
          estadisticas.map(stat => (
            <div key={stat.team.id}>
              <h3>{stat.team.name}</h3>
              <img src={stat.team.logo} alt={stat.team.name} width="50" />
              <ul>
                {stat.statistics.map((statItem, index) => (
                  <li key={index}>{statItem.type}: {statItem.value || 0}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No hay estadísticas disponibles para este partido.</p>
        )}
      </div>

      {/* Mostrar eventos */}
      <h2>Eventos</h2>
      <ul className="eventos">
        {eventos.length > 0 ? (
          eventos.map((evento, index) => (
            <li key={index}>
              {evento.time.elapsed}' - {evento.player ? evento.player.name : 'Desconocido'} ({evento.team.name}) - {evento.type}: {evento.detail}
            </li>
          ))
        ) : (
          <p>No hay eventos disponibles para este partido.</p>
        )}
      </ul>
    </div>
  );
}

export default PartidoDetalle;

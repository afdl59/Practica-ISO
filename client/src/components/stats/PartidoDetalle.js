import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PartidoDetalle() {
  const { idPartido } = useParams(); // Obtenemos el id del partido desde la URL
  const [estadisticas, setEstadisticas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
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
        setEstadisticas(dataEstadisticas.response);

        // Cargar eventos
        const responseEventos = await fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${idPartido}`, requestOptions);
        const dataEventos = await responseEventos.json();
        setEventos(dataEventos.response);

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles del partido:', error);
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [idPartido]);

  if (loading) {
    return <h2>Cargando detalles del partido...</h2>;
  }

  return (
    <div className="partido-detalle-container">
      <h1>Detalles del Partido</h1>

      {/* Mostrar estadísticas */}
      <h2>Estadísticas</h2>
      <div className="estadisticas">
        {estadisticas.map(stat => (
          <div key={stat.team.id}>
            <h3>{stat.team.name}</h3>
            <ul>
              {stat.statistics.map((statItem, index) => (
                <li key={index}>{statItem.type}: {statItem.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mostrar eventos */}
      <h2>Eventos</h2>
      <ul className="eventos">
        {eventos.map(evento => (
          <li key={evento.time.elapsed}>
            {evento.time.elapsed}': {evento.player.name} ({evento.team.name}) - {evento.type} ({evento.detail})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PartidoDetalle;

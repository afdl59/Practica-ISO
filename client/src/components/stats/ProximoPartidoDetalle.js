import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/stats/ProximoPartidoDetalle.css';

const ProximoPartidoDetalle = () => {
  const { idPartido } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setLoading(true);

      try {
        const myHeaders = new Headers();
        myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
        myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        const url = `https://v3.football.api-sports.io/fixtures?id=${idPartido}`;

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setMatch(data.response[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles del partido:', error);
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [idPartido]);

  if (loading) {
    return <h2>Cargando detalles del partido...</h2>;
  }

  if (!match) {
    return <h2>No se encontró el partido solicitado.</h2>;
  }

  const { fixture, teams, league, venue } = match;

  const formattedDate = new Date(fixture.date).toLocaleDateString('es-ES');
  const formattedTime = new Date(fixture.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="match-detail-container">
      <h1>{league.name}</h1>
      <div className="match-overview">
        <img src={teams.home.logo} alt={teams.home.name} className="team-logo" />
        <span>vs</span>
        <img src={teams.away.logo} alt={teams.away.name} className="team-logo" />
      </div>
      <p>{`${teams.home.name} vs ${teams.away.name}`}</p>
      <p>{formattedDate} - {formattedTime}</p>
      <p>Estadio: {venue.name}, {venue.city}</p>
      <p>Jornada: {fixture.round}</p>
    </div>
  );
};

export default ProximoPartidoDetalle;

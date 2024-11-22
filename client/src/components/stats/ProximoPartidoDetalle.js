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
      const headers = new Headers({
        'x-rapidapi-key': '00cb0f459f2d3b04f9dcc00ad403423d',
        'x-rapidapi-host': 'v3.football.api-sports.io',
      });

      const url = `https://v3.football.api-sports.io/fixtures?id=${idPartido}`;
      try {
        const response = await fetch(url, { method: 'GET', headers });
        const data = await response.json();
        setMatch(data.response[0]);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
      setLoading(false);
    };

    fetchMatchDetails();
  }, [idPartido]);

  if (loading) {
    return <div className="loading">Cargando detalles del partido...</div>;
  }

  if (!match) {
    return <div className="error">No se encontraron detalles para este partido.</div>;
  }

  const { fixture, teams, league, venue } = match;

  const formattedDate = new Date(fixture.date).toLocaleDateString('es-ES');
  const formattedTime = new Date(fixture.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="match-detail-container">
      <h1>{match.league.name}</h1>
      <div className="match-overview">
        <img src={match.teams.home.logo} alt={match.teams.home.name} className="team-logo" />
        <span>vs</span>
        <img src={match.teams.away.logo} alt={match.teams.away.name} className="team-logo" />
      </div>
      <p>{`${match.teams.home.name} vs ${match.teams.away.name}`}</p>
      <p>{formattedDate} - {formattedTime}</p>
      <p>Estadio: {match.fixture.venue.name}, {match.fixture.venue.city}</p>
      <p>Jornada: {match.league.round}</p>
    </div>
  );
};

export default ProximoPartidoDetalle;

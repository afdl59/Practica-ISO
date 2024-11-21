import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COMPETITIONS = [
  { id: 2, name: 'Champions League' },
  { id: 140, name: 'La Liga' },
  { id: 39, name: 'Premier League' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
];

const ProximosPartidos = () => {
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const headers = new Headers({
        'x-rapidapi-key': '00cb0f459f2d3b04f9dcc00ad403423d',
        'x-rapidapi-host': 'v3.football.api-sports.io',
      });

      const fromDate = new Date().toISOString().split('T')[0];
      const toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const matchData = {};

      for (const competition of COMPETITIONS) {
        const url = `https://v3.football.api-sports.io/fixtures?league=${competition.id}&from=${fromDate}&to=${toDate}`;
        try {
          const response = await fetch(url, { method: 'GET', headers });
          const data = await response.json();
          matchData[competition.name] = data.response;
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      }

      setMatches(matchData);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div className="loading">Cargando partidos...</div>;
  }

  return (
    <div className="proximos-partidos-container">
      <h1>Próximos Partidos</h1>
      {Object.keys(matches).map((competition) => (
        <div key={competition} className="competition-section">
          <h2>{competition}</h2>
          {matches[competition].length > 0 ? (
            matches[competition].map((match) => (
              <div
                key={match.fixture.id}
                className="match-card"
                onClick={() => navigate(`/proximos-partidos/${match.fixture.id}`)}
              >
                <div className="match-info">
                  <img src={match.teams.home.logo} alt={match.teams.home.name} className="team-logo" />
                  <span>vs</span>
                  <img src={match.teams.away.logo} alt={match.teams.away.name} className="team-logo" />
                </div>
                <div className="match-details">
                  <p>{`${match.teams.home.name} vs ${match.teams.away.name}`}</p>
                  <p>{new Date(match.fixture.date).toLocaleDateString('es-ES')} - {new Date(match.fixture.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay partidos programados.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProximosPartidos;

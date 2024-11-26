import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/stats/Predicciones.css';

function Predicciones() {
    const [predictions, setPredictions] = useState([]);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPredictions = async () => {
            const response = await fetch('/api/auth/check-session');
            if (!response.ok){
                return navigate('/login');
            } else {
                const userData = await response.json();
                setUsername(userData.username);
            }

            const userData = await response.json();

            // Comprobar partidos terminados y actualizar predicciones
            const headers = new Headers({
                'x-rapidapi-key': '00cb0f459f2d3b04f9dcc00ad403423d',
                'x-rapidapi-host': 'v3.football.api-sports.io',
            });

            var requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            };

            const updatedPredictions = [];
            for (const [matchId, userPrediction] of userData.prediccionesActuales) {
                const matchResponse = await fetch(`https://v3.football.api-sports.io/fixtures?id=${matchId}`, requestOptions);
                const matchData = await matchResponse.json();
                const matchDetails = matchData.response[0];

                if (matchDetails.fixture.status.long === 'Match Finished') {
                    const homeWon = matchDetails.teams.home.winner;
                    const awayWon = matchDetails.teams.away.winner;

                    const correct = (
                        (userPrediction === 'home' && homeWon) ||
                        (userPrediction === 'away' && awayWon) ||
                        (userPrediction === 'draw' && !homeWon && !awayWon)
                    );

                    if (correct) {
                        await fetch(`/api/users/${username}/predictions`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ points: 3 }),
                        });
                    }

                    // Eliminar predicción por partido terminado
                    await fetch(`/api/users/${username}/remove-prediction`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ matchId }),
                    });

                } else {
                    updatedPredictions.push(matchDetails);
                }
            }
            setPredictions(updatedPredictions);
        };

        fetchPredictions();
    }, [navigate]);

  return (
    <div className="predictions-container">
      <h1>Tus Predicciones</h1>
      {predictions.length > 0 ? (
        predictions.map((match, index) => (
          <div key={index} className="prediction-item">
            <p>{match.teams.home.name} vs {match.teams.away.name}</p>
            <p>{new Date(match.fixture.date).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No tienes predicciones activas.</p>
      )}
    </div>
  );
}

export default Predicciones;

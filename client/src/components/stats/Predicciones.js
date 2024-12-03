import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/stats/Predicciones.css';

function Predicciones() {
    const [predictions, setPredictions] = useState({
        prediccionesActuales: [],
    });
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPredictions = async () => {
          const response = await fetch('/api/auth/check-session');
          if (!response.ok) {
              return navigate('/login');
          }
          const data = await response.json();
  
          // Fetch para obtener las predicciones del usuario
          const predictionsResponse = await fetch(`/api/users/${data.username}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
          });
          if (!predictionsResponse.ok) {
              console.error('Error al obtener predicciones del usuario');
              return;
          }
          const predictionsData = await predictionsResponse.json();
          console.log(`Respuesta check-session: ${predictionsData}`);
          
          // Asegúrate de actualizar el estado en el orden correcto
          setUserData(predictionsData);
          setPredictions({
              prediccionesActuales: predictionsData.prediccionesActuales || [],
          });

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
        for (const userPrediction of predictions.prediccionesActuales) {
            const { matchId, prediction} = userPrediction;
            const matchResponse = await fetch(`https://v3.football.api-sports.io/fixtures?id=${matchId}`, requestOptions);
            const matchData = await matchResponse.json();
            const matchDetails = matchData.response[0];

            if (matchDetails.fixture.status.long === 'Match Finished') {
                const homeWon = matchDetails.teams.home.winner;
                const awayWon = matchDetails.teams.away.winner;

                const correct = (
                    (prediction === 'home' && homeWon) ||
                    (prediction === 'away' && awayWon) ||
                    (prediction === 'draw' && !homeWon && !awayWon)
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

import React, { useEffect, useState } from 'react';

function Rankings() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const response = await fetch('/api/users/predictionsRanking');
            if (!response.ok) {
                console.error('Error al obtener el ranking');
                return;
            }
            const leaderboardData = await response.json();
            setLeaderboard(leaderboardData);
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container">
            <h1>Ranking de Minijuegos</h1>
            <pre>{JSON.stringify(leaderboard, null, 2)}</pre>
        </div>
    );
}

export default Rankings;
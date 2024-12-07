// minijuegos/Leaderboard.js
import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

function Leaderboard({ gameType }) {
    const { leaderboards } = useLeaderboard();

    if (!leaderboards[gameType]) {
        return <p>Categoria no encontrada.</p>;
    }

    return (
        <div>
            <h2>{gameType} Leaderboard</h2>
            <ul>
                {leaderboards[gameType].map(({ playerName, score, date }, index) => (
                    <li key={index}>
                        {index + 1}. {playerName} - {score} puntos ({new Date(date).toLocaleDateString()})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;
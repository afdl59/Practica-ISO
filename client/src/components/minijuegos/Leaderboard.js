// minijuegos/Leaderboard.js
import React from 'react';
import { useLeaderboard } from '../LeaderboardContext';

function Leaderboard({ gameType }) {
    const { leaderboards } = useLeaderboard();

    return (
        <div>
            <h2>{gameType} Leaderboard</h2>
            <ul>
                {leaderboards[gameType].map(({ playerName, score, date }, index) => (
                    <li key={index}>{playerName} - {score} points on {new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;

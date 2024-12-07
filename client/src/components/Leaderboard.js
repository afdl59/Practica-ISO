// minijuegos/Leaderboard.js
import React, { useState } from 'react';
import { useLeaderboard } from '../../context/LeaderboardContext';
import '../styles/leaderboard/Leaderboard.css';

function Leaderboard() {
    const { leaderboards } = useLeaderboard();
    const categories = Object.keys(leaderboards);
    const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');

    useEffect(() => {
        if (categories.length > 0 && !categories.includes(selectedCategory)) {
            setSelectedCategory(categories[0]); // Actualiza si cambian las categorías
        }
    }, [categories, selectedCategory]);

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            {/* Filtros de categorías */}
            <div className="categories">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={selectedCategory === category ? 'active' : ''}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tabla del leaderboard */}
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Jugador</th>
                        <th>Puntuación</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboards[selectedCategory]?.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.playerName}</td>
                            <td>{entry.score}</td>
                            <td>{new Date(entry.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;

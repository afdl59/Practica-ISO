// LeaderboardContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
    const [leaderboards, setLeaderboards] = useState({
        bingo: [],
        guessThePlayer: [],
        tiroLibre: [],
        wordle: [],
        predicciones: [],
    });

    useEffect(() => {
        async function fetchLeaderboards() {
            try {
                const response = await fetch('/api/leaderboards'); // Endpoint del backend
                const data = await response.json();
                setLeaderboards(data);
            } catch (error) {
                console.error('Error fetching leaderboards:', error);
            }
        }
        fetchLeaderboards();
    }, []);

    function updateLeaderboard(game, playerName, score) {
        setLeaderboards(prev => ({
            ...prev,
            [game]: [...prev[game], { playerName, score, date: new Date() }]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10),
        }));
    }

    return (
        <LeaderboardContext.Provider value={{ leaderboards, updateLeaderboard }}>
            {children}
        </LeaderboardContext.Provider>
    );
}

export function useLeaderboard() {
    return useContext(LeaderboardContext);
}
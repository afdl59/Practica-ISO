// LeaderboardContext.js
import { createContext, useContext, useState } from 'react';

const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
    const [leaderboards, setLeaderboards] = useState({
        bingo: [],
        guessThePlayer: [],
        tiroLibre: [],
        wordle: [],
    });

    function updateLeaderboard(game, playerName, score) {
        setLeaderboards(prev => ({
            ...prev,
            [game]: [...prev[game], { playerName, score, date: new Date() }]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10) // Only keep top 10 scores
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

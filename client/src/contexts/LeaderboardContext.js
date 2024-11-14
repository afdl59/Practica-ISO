// src/contexts/LeaderboardContext.js
import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';

const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const { username } = useUser();
  const [leaderboard, setLeaderboard] = useState({});

  const updateLeaderboard = (game, score) => {
    if (username) {
      setLeaderboard((prev) => ({
        ...prev,
        [game]: { ...prev[game], [username]: score },
      }));
    }
  };

  return (
    <LeaderboardContext.Provider value={{ leaderboard, updateLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => useContext(LeaderboardContext);

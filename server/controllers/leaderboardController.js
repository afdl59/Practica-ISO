// controllers/leaderboardController.js
const User = require('../models/User');

const getLeaderboards = async (req, res) => {
    try {
        const users = await User.find({}, 'username puntos');
        const leaderboards = {
            bingo: [],
            guessThePlayer: [],
            tiroLibre: [],
            wordle: [],
            predicciones: [],
        };

        users.forEach(user => {
            for (const category in user.puntos) {
                leaderboards[category].push({
                    playerName: user.username,
                    score: user.puntos[category],
                });
            }
        });

        for (const category in leaderboards) {
            leaderboards[category] = leaderboards[category]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10); // Top 10
        }

        res.json(leaderboards);
    } catch (error) {
        console.error('Error fetching leaderboards:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    getLeaderboards,
};
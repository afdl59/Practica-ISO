const User = require('../models/User');

const getLeaderboards = async (req, res) => {
    try {
        // Inicializar las categorías del leaderboard como objetos vacíos
        const leaderboards = {
            bingo: {},
            guessThePlayer: {},
            tiroLibre: {},
            wordle: {},
            predicciones: {},
        };

        // Obtener los usuarios desde la base de datos
        const users = await User.find({}, 'username puntos');

        // Recorrer los usuarios y llenar las categorías
        users.forEach(user => {
            if (user.puntos) {
                for (const category in user.puntos) {
                    // Asegurarse de que la categoría exista en leaderboards
                    if (leaderboards.hasOwnProperty(category)) {
                        // Agregar al objeto clave-valor con el nombre del usuario como clave
                        leaderboards[category][user.username] = user.puntos[category];
                    }
                }
            }
        });

        // Convertir los objetos en arreglos ordenados por puntuación
        const sortedLeaderboards = {};
        for (const category in leaderboards) {
            sortedLeaderboards[category] = Object.entries(leaderboards[category])
                .map(([playerName, score]) => ({ playerName, score }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 10); // Limitar a los 10 mejores
        }

        res.status(200).json(sortedLeaderboards);
    } catch (error) {
        console.error('Error fetching leaderboards:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getLeaderboards,
};

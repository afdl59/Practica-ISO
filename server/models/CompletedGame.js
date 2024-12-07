// models/CompletedGame.js

const mongoose = require('mongoose');

const completedGameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
    gameId: { type: String, required: true }, // Identificador del minijuego (por ejemplo, 'Bingo')
    puntosGanados: { type: Number, required: true }, // Puntos ganados en ese minijuego
    completedAt: { type: Date, default: Date.now }, // Fecha de finalización
});

module.exports = mongoose.model('CompletedGame', completedGameSchema);

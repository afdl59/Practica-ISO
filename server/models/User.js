// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String,
        required: function () {
            // Requiere contraseña solo si no tiene googleId ni twitterId
            return (!this.googleId && !this.twitterId);
        }
    },
    fotoPerfil: { type: String },
    googleId: { type: String, unique: true },
    twitterId: { type: String, unique: true},
    equipoFavorito: { type: [String], default: [] },
    competicionesFavoritas: { type: [String], default: [] },
    prediccionesActuales: { type: Array, default: [] },
    puntos: {
        bingo: { type: Number, default: 0 },
        guessThePlayer: { type: Number, default: 0 },
        tiroLibre: { type: Number, default: 0 },
        wordle: { type: Number, default: 0 },
        predicciones: { type: Number, default: 0 },
    },
    isPremium: { type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
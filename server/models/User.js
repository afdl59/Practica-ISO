// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fotoPerfil: { type: String },
    equipoFavorito: { type: [String], default: [] }, // Nuevo campo para el equipo favorito
    competicionesFavoritas: { type: [String], default: [] }, // Nuevo campo para competiciones favoritas
    createdAt: { type: Date, default: Date.now },
    prediccionesActuales: { type: Array, default: [] }, // Nuevo campo para almacenar las predicciones del usuario
    puntosPredicciones: { type: Number, default: 0 }, // Nuevo campo para almacenar los puntos de las predicciones del usuario
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

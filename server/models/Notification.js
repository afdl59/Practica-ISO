const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    username: { type: String, ref: 'User', required: true },
    type: { type: String, required: true }, // 'foro' o 'estadisticas'
    content: { type: String, required: true }, // Mensaje breve
    isRead: { type: Boolean, default: false }, // Para marcar si ya fue leída
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

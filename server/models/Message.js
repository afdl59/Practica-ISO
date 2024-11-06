// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    username: { type: String, required: true },
    chatRoom: { type: String, ref: 'ChatRoom', required: true },
});

module.exports = mongoose.model('Message', messageSchema);

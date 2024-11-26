// models/ChatRoom.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    numMessages: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, ref: 'User', required: true },
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);

// models/LoginIp.js
const mongoose = require('mongoose');

const LoginIpSchema = new mongoose.Schema({
    username: { type: String, ref: 'User', required: true, unique: false },
    ip: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoginIp', LoginIpSchema);

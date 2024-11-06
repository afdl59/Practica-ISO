// controllers/chatController.js
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');

// Obtener todas las salas de chat
exports.getAllRooms = async (req, res) => {
    try {
        const salas = await ChatRoom.find({});
        res.status(200).json(salas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las salas de chat: ' + err.message });
    }
};

// Crear una nueva sala de chat
exports.createRoom = async (req, res) => {
    const { title, description, createdBy } = req.body; // `createdBy` será el username
    try {
        // Verificar si el usuario existe en la colección de usuarios
        const user = await User.findOne({ username: createdBy });
        if (!user) {
            return res.status(400).json({ message: 'Usuario creador no válido' });
        }

        // Crear una nueva instancia de ChatRoom con el username del creador
        const newChatRoom = new ChatRoom({ title, description, createdBy });
        await newChatRoom.save();
        res.status(201).json({ message: 'Sala creada exitosamente', newChatRoom });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la sala de chat: ' + err.message });
    }
};

// Obtener los mensajes de una sala específica
exports.getMessages = async (req, res) => {
    const { id } = req.params;
    try {
        const mensajes = await Message.find({ chatRoom: id });
        res.status(200).json(mensajes);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los mensajes: ' + err.message });
    }
};

// Enviar un mensaje a una sala de chat específica
exports.postMessage = async (req, res) => {
    const { id } = req.params;
    const { username, content } = req.body;
    try {
        const newMessage = new Message({ content, username: username, chatRoom: id });
        await newMessage.save();

        // Emitir mensaje a todos los conectados a través de Socket.IO
        req.io.to(id).emit('mensajeRecibido', {
            content,
            username: username,
            chatRoom: id,
            date: newMessage.date
        });
        res.status(201).json({ message: 'Mensaje enviado exitosamente', newMessage });
    } catch (err) {
        res.status(500).json({ message: 'Error al enviar el mensaje: ' + err.message });
    }
};

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

// Obtener los datos de una sala específica
exports.getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const sala = await ChatRoom.findById(id);
        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.status(200).json(sala);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la sala: ' + err.message });
    }
};

// Crear una nueva sala de chat
exports.createRoom = async (req, res) => {
    const { title, description, category, createdBy } = req.body; // Incluir category
    try {
        const user = await User.findOne({ username: createdBy });
        if (!user) {
            return res.status(400).json({ message: 'Usuario creador no válido' });
        }

        const newChatRoom = new ChatRoom({ title, description, category, createdBy });
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

// Actualizar una sala de chat
exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedRoom = await ChatRoom.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.status(200).json({ message: 'Sala actualizada correctamente', updatedRoom });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la sala: ' + err.message });
    }
};

// Limpiar mensajes de una sala de chat
exports.clearMessages = async (req, res) => {
    const { id } = req.params;
    try {
        await Message.deleteMany({ chatRoom: id });
        res.status(200).json({ message: 'Mensajes eliminados correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar los mensajes: ' + err.message });
    }
};

// Eliminar una sala de chat
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRoom = await ChatRoom.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        await Message.deleteMany({ chatRoom: id }); // Eliminar los mensajes asociados
        res.status(200).json({ message: 'Sala eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la sala: ' + err.message });
    }
};

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Ruta para obtener todas las salas de chat
router.get('/salas', chatController.getAllRooms);

// Ruta para crear una nueva sala de chat
router.post('/salas', chatController.createRoom);

// Ruta para obtener los mensajes de una sala específica
router.get('/salas/:id/mensajes', chatController.getMessages);

// Ruta para enviar un mensaje a una sala de chat específica
router.post('/salas/:id/mensajes', chatController.postMessage);

// Ruta para actualizar una sala de chat
router.put('/salas/:id', chatController.updateRoom);

// Ruta para limpiar los mensajes de una sala
router.delete('/salas/:id/mensajes', chatController.clearMessages);

// Ruta para eliminar una sala de chat
router.delete('/salas/:id', chatController.deleteRoom);

module.exports = router;


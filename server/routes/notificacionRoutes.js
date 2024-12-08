const express = require('express');
const { sendNotificationEmail, getNotifications, markAsRead, searchUsers } = require('../controllers/notificacionController');
const router = express.Router();

// Endpoint para enviar notificaciones por correo
router.post('/enviar', sendNotificationEmail);

// Obtener todas las notificaciones de un usuario
router.get('/:username', getNotifications);

// Marcar notificación como leída
router.patch('/marcar-leida/:notificationId', markAsRead);

router.get('/users', (req, res, next) => {
    console.log('Se llamó al endpoint /users');
    next();
  }, searchUsers);  

module.exports = router;

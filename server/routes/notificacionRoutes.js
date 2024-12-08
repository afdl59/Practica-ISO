const express = require('express');
const { sendNotificationEmail, getNotifications, markAsRead, searchUsers } = require('../controllers/notificacionController');
const router = express.Router();

// Endpoint para enviar notificaciones por correo
router.post('/enviar', sendNotificationEmail);

// Obtener todas las notificaciones de un usuario
router.get('/:username', getNotifications);

// Marcar notificación como leída
router.patch('/marcar-leida/:notificationId', markAsRead);

router.use((req, res, next) => {
    console.log(`Solicitud recibida en notificacionRoutes: ${req.path}`);
    next();
});
    
// Endpoint para buscar usuarios
router.get('/users', searchUsers);

module.exports = router;

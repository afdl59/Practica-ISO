const express = require('express');
const { sendNotificationEmail, getNotifications, markAsRead } = require('../controllers/notificacionController');
const router = express.Router();

// Endpoint para enviar notificaciones por correo
router.post('/enviar', sendNotificationEmail);

// Obtener todas las notificaciones de un usuario
router.get('/:username', getNotifications);

// Marcar notificación como leída
router.patch('/marcar-leida/:notificationId', markAsRead);

router.get('/users', async (req, res) => {
    const { search } = req.query;
    try {
      const users = await User.find({ username: { $regex: search, $options: 'i' } })
        .limit(10)
        .select('username');
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      res.status(500).json({ message: 'Error al buscar usuarios' });
    }
  });
  

module.exports = router;

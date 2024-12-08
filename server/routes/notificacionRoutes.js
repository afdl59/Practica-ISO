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
    const { search } = req.query; // Extrae la query
    if (!search) {
      return res.status(400).json({ message: 'El parámetro de búsqueda es obligatorio.' });
    }
  
    try {
      // Asegúrate de que el valor sea tratado como una cadena
      const regexSearch = new RegExp(search, 'i'); // Genera un regex dinámico e insensible a mayúsculas
  
      const users = await User.find({
        username: { $regex: regexSearch },
      })
        .limit(10) // Limitar resultados
        .select('username'); // Solo devuelve los nombres de usuario
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json(users); // Devuelve los resultados
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      res.status(500).json({ message: 'Error al buscar usuarios' });
    }
});

module.exports = router;

const Notification = require('../models/Notification');
const User = require('../models/User');
const transporter = require('../services/emailService');

const sendNotificationEmail = async (req, res) => {
    const { username, type } = req.body;

    try {
        // Busca al usuario en la base de datos
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Guarda la notificación en la base de datos
        const newNotification = new Notification({
            username,
            type,
            content: `Tienes una nueva notificación relacionada con ${type === 'foro' ? 'el foro' : 'estadísticas'}.`
        });

        await newNotification.save();

        // Configuración del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Nuevas Notificaciones en Futbol360',
            text: `Hola ${user.username}, tienes nuevas notificaciones. Revisa en: futbol360.ddns.net/notificaciones/${user.username}`
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Notificación creada y correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al procesar la notificación:', error);
        res.status(500).json({ message: 'Error al procesar la notificación' });
    }
};

const getNotifications = async (req, res) => {
    const { username } = req.params;

    try {
        // Encuentra al usuario por su nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const notifications = await Notification.find({ username: user.username }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error al obtener las notificaciones' });
    }
};

const markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error al marcar la notificación como leída:', error);
        res.status(500).json({ message: 'Error al marcar la notificación como leída' });
    }
};

const searchUsers = async (req, res) => {
    const { search } = req.query;
  
    if (!search) {
      return res.status(400).json({ message: 'El parámetro de búsqueda es obligatorio.' });
    }
  
    console.log('Valor de búsqueda:', search); // Debe mostrar el texto de la query
    
    try {
      const regexSearch = new RegExp(search, 'i'); // Genera un regex dinámico e insensible a mayúsculas
      
      console.log('Regex generado:', new RegExp(search, 'i')); // Muestra la expresión regular que se usará
      const users = await User.find({
        username: { $regex: regexSearch },
      })
        .limit(10) // Limitar resultados
        .select('username'); // Solo devuelve los nombres de usuario
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      res.status(500).json({ message: 'Error al buscar usuarios' });
    }
};

module.exports = { sendNotificationEmail, getNotifications, markAsRead, searchUsers };


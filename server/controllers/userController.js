// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');
const LoginIp = require('../models/LoginIp');

// Registro de usuario con envío de correo de bienvenida
exports.register = async (req, res) => {
    const { username, firstName, lastName, email, password, equipoFavorito, competicionesFavoritas } = req.body;
    try {
        const nuevoUsuario = new User({ username, firstName, lastName, email, password, equipoFavorito, competicionesFavoritas });
        await nuevoUsuario.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Bienvenido a Futbol360',
            text: `Hola ${username},\n\nGracias por registrarte en Futbol360. ¡Esperamos que disfrutes de la plataforma!\n\nSaludos,\nEl equipo de Futbol360`
        };

        emailService.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).send('Error al enviar el correo');
            }
            console.log(`Correo enviado: ${info.response}`);
            res.status(201).json({ message: 'Usuario registrado y correo enviado' });
        });
    } catch (err) {
        res.status(400).json({ message: 'Error al registrar usuario: ' + err.message });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const usuario = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const currentIp = req.clientIp;

        // Busca la última IP registrada para este usuario
        const lastLogin = await LoginIp.findOne({ username: usuario.username }).sort({ date: -1 });

        // Si la IP es diferente, envía una notificación
        if (lastLogin && lastLogin.ip !== currentIp) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: usuario.email,
                subject: 'Notificación de inicio de sesión',
                html: `
                    <p>Hemos detectado un inicio de sesión desde una IP diferente a la habitual.</p>
                    <p><strong>IP actual:</strong> ${currentIp}</p>
                    <p><strong>IP previa:</strong> ${lastLogin.ip}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
                    <p>Si no reconoces esta actividad, por favor cambia tu contraseña inmediatamente.</p>
                `,
            };

            emailService.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar la notificación:', error);
                }
            });
        }

        // Guarda la nueva IP en la colección
        const newLogin = new LoginIp({ username: usuario.username, ip: currentIp });
        await newLogin.save();

        // Configurar datos de sesión
        req.session.userId = usuario._id;
        req.session.username = usuario.username;
        req.session.user = {
            id: usuario._id,
            username: usuario.username,
            email: usuario.email,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            equipoFavorito: usuario.equipoFavorito,
            competicionesFavoritas: usuario.competicionesFavoritas,
            fotoPerfil: usuario.fotoPerfil,
        };

        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar la sesión' });
            }
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                user: req.session.user
            });
        });
    } catch (err) {
        res.status(400).json({ message: 'Error al iniciar sesión: ' + err.message });
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Sesión cerrada correctamente' });
    });
};

// Obtener datos de un usuario específico
exports.getUserProfile = async (req, res) => {
    if (!req.session) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const { username } = req.params;
    try {
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            username: usuario.username,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            fotoPerfil: usuario.fotoPerfil || null,
            equipoFavorito: usuario.equipoFavorito || [],
            competicionesFavoritas: usuario.competicionesFavoritas || [],
            prediccionesActuales: usuario.prediccionesActuales || [],
            puntosPredicciones: usuario.puntosPredicciones || 0,
            ultimoLogin: usuario.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los datos del usuario: ' + err.message });
    }
};

// Actualizar perfil de usuario
exports.updateUserProfile = async (req, res) => {
    const { username } = req.params;
    const { firstName, lastName, equipoFavorito, competicionesFavoritas } = req.body;

    console.log("Datos recibidos para actualizar:", req.body); // Verificar los datos recibidos

    try {
        const usuario = await User.findOne({ username });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar solo si existen valores nuevos en el req.body
        usuario.firstName = firstName || usuario.firstName;
        usuario.lastName = lastName || usuario.lastName;
        usuario.equipoFavorito = equipoFavorito || usuario.equipoFavorito;
        usuario.competicionesFavoritas = competicionesFavoritas || usuario.competicionesFavoritas;

        console.log("Usuario antes de guardar:", usuario); // Confirmar valores antes de guardar

        await usuario.save();
        res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: usuario
        });
    } catch (err) {
        console.error('Error al actualizar los datos del usuario:', err);
        res.status(500).json({ message: 'Error al actualizar los datos del usuario' });
    }
};

// Subir imagen de perfil
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }
        if (req.file === undefined) {
            return res.status(400).json({ message: 'El file es undefined' });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const { username } = req.body;
        const usuario = await User.findOne({ username });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.fotoPerfil = imageUrl;
        await usuario.save();

        res.status(200).json({ message: 'Imagen subida correctamente', imageUrl });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error al subir la imagen' });
    }
};

// Actualizar puntos de un usuario
exports.updateUserPoints = async (req, res) => {
    const { username } = req.params;
    const { points } = req.body;

    try {
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.points = (usuario.points || 0) + points;
        await usuario.save();
        res.status(200).json({ message: 'Puntos actualizados', user: usuario });
    } catch (err) {
        console.error('Error al actualizar puntos:', err);
        res.status(500).json({ message: 'Error al actualizar puntos' });
    }
};

// Obtener el ranking de usuarios
exports.getRanking = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;

    try {
        const usuarios = await User.find({})
            .sort({ points: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            ranking: usuarios.map((usuario, index) => ({
                position: index + 1 + (page - 1) * limit,
                username: usuario.username,
                points: usuario.points || 0
            }))
        });
    } catch (err) {
        console.error('Error al obtener ranking:', err);
        res.status(500).json({ message: 'Error al obtener ranking' });
    }
};

// Actualizar puntos de predicciones de usuario
exports.updateUserPredictionsPoints = async (req, res) => {
    const { username } = req.params;
    const { points } = req.body;

    try {
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.puntosPredicciones = (usuario.predictionPoints || 0) + points;
        await usuario.save();
        res.status(200).json({ message: 'Puntos de predicciones actualizados', user: usuario });
    } catch (err) {
        console.error('Error al actualizar puntos de predicciones:', err);
        res.status(500).json({ message: 'Error al actualizar puntos de predicciones' });
    }
};

// Añadir predicción de usuario
exports.addUserPrediction = async (req, res) => {
    const { username } = req.params;
    const { matchId, prediction } = req.body;

    try {
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const nuevaPrediccion = { matchId, prediction };
        usuario.prediccionesActuales.push(nuevaPrediccion);
        await usuario.save();
        res.status(201).json({ message: 'Predicción añadida correctamente', user: usuario });
    } catch (err) {
        console.error('Error al añadir predicción:', err);
        res.status(500).json({ message: 'Error al añadir predicción' });
    }
};

// Obtener lista de predicciones de usuario
exports.getUserPredictions = async (req, res) => {
    const { username } = req.params;

    try {
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ prediccionesActuales: usuario.prediccionesActuales });
    } catch (err) {
        console.error('Error al obtener las predicciones:', err);
        res.status(500).json({ message: 'Error al obtener las predicciones' });
    }
};

// Eliminar predicción de usuario
exports.deleteUserPrediction = async (req, res) => {
    const { username } = req.params;
    const { matchId } = req.body;

    try {
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.prediccionesActuales = usuario.prediccionesActuales.filter(prediccion => prediccion.matchId !== matchId);
        await usuario.save();
        res.status(200).json({ message: 'Predicción eliminada correctamente', user: usuario });
    } catch (err) {
        console.error('Error al eliminar predicción:', err);
        res.status(500).json({ message: 'Error al eliminar predicción' });
    }
};

// Solicitud de ayuda por correo electrónico
exports.sendHelpRequest = async (req, res) => {
    const { subject, message } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const mailOptions = {
        from: 'Futbol360 <futbol360.client@gmail.com>',
        to: 'futbol360.client@gmail.com',
        replyTo: user.email, //Email del usuario para recibir las respuestas
        subject: `[Futbol360] ${subject}`,
        text: `Mensaje de: ${user.email}\n\n${message}`,
    };

    emailService.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo de ayuda:', error);
            return res.status(500).json({ message: 'Error al enviar el correo' });
        }
        console.log('Correo de ayuda enviado:', info.response);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    });
};
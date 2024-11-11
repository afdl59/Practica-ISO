// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');

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
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

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
    if (!req.session.userId) {
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

    try {
        const usuario = await User.findOne({ username });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.firstName = firstName || usuario.firstName;
        usuario.lastName = lastName || usuario.lastName;
        usuario.equipoFavorito = equipoFavorito || usuario.equipoFavorito;
        usuario.competicionesFavoritas = competicionesFavoritas || usuario.competicionesFavoritas;

        await usuario.save();
        res.status(200).json(usuario);
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

        const imageUrl = `${req.protocol}://api/users/uploads/${req.file.filename}`;
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

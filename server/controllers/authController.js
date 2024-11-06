// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');

// Registro de usuario
exports.register = async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;
    try {
        const nuevoUsuario = new User({ username, firstName, lastName, email, password });
        await nuevoUsuario.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Bienvenido a Futbol360',
            text: `Hola ${username},\n\nGracias por registrarte en Futbol360.`,
        };

        emailService.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).send('Error al enviar el correo');
            res.status(201).send('Usuario registrado y correo enviado');
        });
    } catch (err) {
        res.status(400).send('Error al registrar usuario: ' + err.message);
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
            intereses: usuario.intereses,
            fotoPerfil: usuario.fotoPerfil,
            messages: usuario.messages
        };

        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar la sesión' });
            }
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                user: {
                    username: usuario.username,
                    firstName: usuario.firstName,
                    lastName: usuario.lastName,
                    email: usuario.email,
                    fotoPerfil: usuario.fotoPerfil,
                    equipoFavorito: usuario.equipoFavorito,
                    intereses: usuario.intereses,
                    createdAt: usuario.createdAt,
                    messages: usuario.messages
                }
            });
        });
        
    } catch (err) {
        res.status(400).json({ message: 'Error al iniciar sesión: ' + err.message });
    }
};

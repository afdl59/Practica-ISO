const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/futbol360')
    .then(() => {
        console.log('Conectado a MongoDB');
    }).catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    });

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Cifrar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

// Inicializar Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build'))); // Servir archivos estáticos desde /build

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Ruta para manejar el registro
app.post('/api/register', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

    try {
        const nuevoUsuario = new User({ username, firstName, lastName, email, password });
        await nuevoUsuario.save();

        // Configurar el correo de bienvenida
        const mailOptions = {
            from: 'futbol360.client@gmail.com',
            to: email,
            subject: 'Bienvenido a Futbol360',
            text: `Hola ${username},\n\nGracias por registrarte en Futbol360. ¡Esperamos que disfrutes de la plataforma!\n\nSaludos,\nEl equipo de Futbol360`
        };

        // Enviar el correo de bienvenida
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error al enviar el correo:', error);
            }
            console.log(`Correo enviado: ${info.response}`);
        });

        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error al registrar usuario: ' + err.message);
    }
});

const fs = require('fs');
const logStream = fs.createWriteStream('server.log', { flags: 'a' });

// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body; // Puede ser email o username

    try {
        logStream.write(`Datos recibidos en la solicitud: ${JSON.stringify(req.body)}\n`);
        logStream.write(`Buscando usuario con identificador: ${identifier}\n`);
        const usuario = await User.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });
        if (!usuario) {
            logStream.write('Usuario no encontrado\n');
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        logStream.write(`Usuario encontrado: ${JSON.stringify(usuario)}\n`);
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            logStream.write('Contraseña incorrecta\n');
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        logStream.write('Inicio de sesión exitoso\n');
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
        logStream.write(`Error durante el proceso de inicio de sesión: ${err}\n`);
        res.status(400).json({ message: 'Error al iniciar sesión: ' + err.message });
    }
});


// Manejar rutas de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'futbol360.client@gmail.com',
        pass: 'Futbol-360-mail'
    }
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs');

//Conectar servicio de mail
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    logger: true,
    debug: true
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

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
    fotoPerfil: {
        type: String,  // Guardará la imagen como una cadena en formato base64 o una URL
        default: null,
    },
    equipoFavorito: {
        type: String,
        default: '',
    },
    intereses: {
        type: [String],  // Almacena los intereses del usuario como un array de strings
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    messages: [
        {
            content: { type: String, required: true },
            date: { type: Date, default: Date.now },
        }
    ]
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
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build'))); // Servir archivos estáticos desde /build

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/futbol360',
        collectionName: 'userSessions',
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Socket.io: manejo de mensajes en tiempo real
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Escuchar evento de nuevo mensaje y guardar en la base de datos
    socket.on('nuevoMensaje', async ({ username, content }) => {
        try {
            const usuario = await User.findOne({ username });
            if (!usuario) {
                return socket.emit('error', 'Usuario no encontrado');
            }

            const nuevoMensaje = { content };
            usuario.messages.push(nuevoMensaje);
            await usuario.save();

            // Emitir el nuevo mensaje a todos los conectados
            io.emit('mensajeRecibido', {
                username,
                content,
                date: nuevoMensaje.date
            });
        } catch (err) {
            socket.emit('error', 'Error al enviar el mensaje');
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});


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
        //verificar la conexión con el servidor de correo
        transporter.verify((error, success) => {
            if (error) {
                console.error('Error al conectar con el servidor de correo:', error);
            } else {
                console.log('Servidor de correo listo para enviar mensajes');
            }
        });

        // Enviar el correo de bienvenida
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).send('Error al enviar el correo');
            }
            console.log(`Correo enviado: ${info.response}`);
            res.status(200).send('Usuario registrado y correo enviado');
        });

        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error al registrar usuario: ' + err.message);
    }
});


// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const usuario = await User.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!usuario || !passwordCorrecta) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Set session data
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
});


//Ruta para checkear la sesion iniciada
app.get('/api/check-session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ 
            isAuthenticated: true, 
            username: req.session.user.username
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Ruta para cerrar sesión
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Sesión cerrada correctamente' });
    });
});

// Ruta para obtener los datos de un usuario específico por su nombre de usuario
app.get('/api/users/:username', async (req, res) => {
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
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            fotoPerfil: usuario.fotoPerfil || null,
            equipoFavorito: usuario.equipoFavorito || '',
            intereses: usuario.intereses || [],
            ultimoLogin: usuario.createdAt
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los datos del usuario: ' + err.message });
    }
});

// Ruta para obtener todos los mensajes de la comunidad
app.get('/api/foro/mensajes', async (req, res) => {
    try {
        // Obtener todos los mensajes de todos los usuarios
        const users = await User.find({}, 'username messages');
        const mensajes = users.flatMap(user => user.messages.map(msg => ({
            username: user.username,
            content: msg.content,
            date: msg.date
        })));

        res.status(200).json(mensajes);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los mensajes: ' + err.message });
    }
});

// Ruta para enviar un nuevo mensaje
app.post('/api/foro/mensajes', async (req, res) => {
    const { username, content } = req.body;

    try {
        // Buscar el usuario y agregar el nuevo mensaje
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.messages.push({ content });
        await usuario.save();

        res.status(200).json({ message: 'Mensaje enviado correctamente' });

    } catch (err) {
        res.status(500).json({ message: 'Error al enviar el mensaje: ' + err.message });
    }
});

// Manejar rutas de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Configuración de conexión a la instancia de MySQL en AWS RDS
const db = mysql.createConnection({
    host: 'transfermarkt-futbol360.c7a8m6o067iu.us-east-1.rds.amazonaws.com',  // El endpoint de tu RDS
    user: 'lorensation',  // Nombre de usuario de MySQL en RDS
    password: 'Pr4ct1c4-1S0',  // Contraseña de MySQL en RDS
    database: 'transfermarktFutbol360',  // Nombre de la base de datos
    port: 3306  // El puerto por defecto de MySQL
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL en AWS RDS');
    }
});

// Ruta para buscar partidos por equipo local
app.get('/api/partidos', (req, res) => {
    const { home_club } = req.query; // Obtenemos el parámetro de búsqueda

    const query = 'SELECT * FROM games WHERE home_club_name LIKE ?';
    db.query(query, [`%${home_club}%`], (err, results) => {
        if (err) {
            return res.status(500).send('Error al buscar partidos: ' + err.message);
        }
        res.json(results); // Enviamos los resultados de la búsqueda como respuesta 
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
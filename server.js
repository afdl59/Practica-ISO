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
const multer = require('multer');
const cors = require('cors');

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

// Definir el esquema de la sala de chat
const chatRoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, ref: 'User', required: true }
});

// Definir el esquema del mensaje
const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String, required: true },
    chatRoom: { type: String, ref: 'ChatRoom', required: true }
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
// Crear los modelos de Sala de Chat y Mensaje
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);

// Inicializar Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build'))); // Servir archivos estáticos desde /build
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos subidos desde /uploads
app.use(cors({
    origin: 'https://futbol360.ddns.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collection: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Configurar multer para almacenar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Asegúrate de que 'uploads' exista
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
const upload = multer({ storage });

// Socket.io: manejo de mensajes en tiempo real
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Escuchar evento de unirse a una sala
    socket.on('unirseASala', (salaId) => {
        socket.join(salaId);
        console.log(`Usuario se unió a la sala: ${salaId}`);
    });

    // Escuchar evento de nuevo mensaje y guardar en la base de datos
    socket.on('nuevoMensaje', async ({ chatRoom, user, content }) => {
        try {
            // Crear el nuevo mensaje con el username directamente
            const nuevoMensaje = new Message({
                content,
                user,
                chatRoom
            });
            await nuevoMensaje.save();
    
            // Emitir el nuevo mensaje a todos los usuarios en la sala
            io.to(chatRoom).emit('mensajeRecibido', {
                username: user,
                content,
                date: nuevoMensaje.date,
                chatRoom
            });
    
            console.log(`Nuevo mensaje en la sala ${chatRoom}: ${content}`);
        } catch (err) {
            console.error('Error al enviar el mensaje:', err);
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
    console.log('Check session endpoint hit');
    if (req.session && req.session.user) {
        console.log('User session exists:', req.session.user);
        res.json({
            isAuthenticated: true,
            username: req.session.username
        });
    } else {
        console.log('No user session found');
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
            username: usuario.username,
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

// Ruta para actualizar los datos de un usuario específico por su nombre de usuario
app.put('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    const { firstName, lastName, equipoFavorito, intereses } = req.body;
  
    try {
      const usuario = await User.findOne({ username });
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      usuario.firstName = firstName || usuario.firstName;
      usuario.lastName = lastName || usuario.lastName;
      usuario.equipoFavorito = equipoFavorito || usuario.equipoFavorito;
      usuario.intereses = intereses || usuario.intereses;
  
      await usuario.save();
      res.status(200).json(usuario);
    } catch (err) {
      console.error('Error al actualizar los datos del usuario:', err);
      res.status(500).json({ message: 'Error al actualizar los datos del usuario' });
    }
  });
  

// Ruta para subir una imagen de perfil
app.post('/api/upload', upload.single('fotoPerfil'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
      }
  
      // Construir la URL de la imagen
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`.replace('http:', 'https:');
  
      // Guardar la URL en la base de datos si es necesario
      const { username } = req.body; // El cliente debe enviar el nombre de usuario para identificar al usuario
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


// Ruta para obtener todas las salas de chat
app.get('/api/foro/salas', async (req, res) => {
    try {
        const salas = await ChatRoom.find({});
        res.status(200).json(salas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las salas de chat: ' + err.message });
    }
});

// Ruta para crear una nueva sala de chat
app.post('/api/foro/salas', async (req, res) => {
    const { title, description, createdBy } = req.body; // `createdBy` será el username
  
    try {
      // Verificar si el usuario existe en la colección de usuarios
      const user = await User.findOne({ username: createdBy });
      if (!user) {
        return res.status(400).json({ message: 'Usuario creador no válido' });
      }
  
      // Crear una nueva instancia de ChatRoom con el username del creador
      const newChatRoom = new ChatRoom({ title, description, createdBy });
      await newChatRoom.save();
      res.status(201).json({ message: 'Sala creada exitosamente', newChatRoom });
    } catch (err) {
      res.status(500).json({ message: 'Error al crear la sala de chat: ' + err.message });
    }
  });

// Ruta para obtener los mensajes de una sala específica
app.get('/api/foro/salas/:id/mensajes', async (req, res) => {
    const { id } = req.params;
    try {
        const mensajes = await Message.find({ chatRoom: id }).populate('user', 'username');
        res.status(200).json(mensajes);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los mensajes: ' + err.message });
    }
});

// Ruta para enviar un mensaje a una sala de chat específica
app.post('/api/foro/salas/:id/mensajes', async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    try {
        const newMessage = new Message({ content, user: userId, chatRoom: id });
        await newMessage.save();

        // Emitir mensaje a todos los conectados
        io.emit('mensajeRecibido', {
            content,
            user: userId,
            chatRoom: id,
            date: newMessage.date
        });

        res.status(201).json({ message: 'Mensaje enviado exitosamente', newMessage });
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

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
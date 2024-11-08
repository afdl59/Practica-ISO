// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const socketHandler = require('./socket');
//prueba webhook
// Conectar a la base de datos
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para pasar `io` a `req` en cada solicitud
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware de configuración
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build'))); // Servir archivos estáticos desde /build
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos subidos desde /uploads
app.use(cors({
    origin: 'https://futbol360.ddns.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configurar middleware de sesión
app.use(sessionMiddleware);

// Rutas de autenticación pública
app.use('/api/auth', authRoutes); 

// Rutas de foro/chat
app.use('/api/foro', chatRoutes); 

// Rutas de usuario, algunas de las cuales requieren autenticación
app.use('/api/users', userRoutes); 

// Inicializar el manejador de Socket.IO
socketHandler(io);

// Servir el cliente de React en cualquier otra ruta
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

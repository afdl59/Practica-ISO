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
const getIpMiddleware = require('./middleware/getIp');
const passport = require('./middleware/passport');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificacionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const socketHandler = require('./socket');

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

//Ruta del webhook para que bodyParser no sobreescriba el middleware de urlencoded
app.use('/api/webhooks', webhookRoutes);

// Middleware de configuración
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, '../client/build'))); // Servir archivos estáticos desde /build
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos subidos desde /uploads
app.use(cors({
    origin: 'https://futbol360.ddns.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Configurar middleware de sesión
app.use(sessionMiddleware);

//Configurar middleware para obtener la IP del cliente
app.use(getIpMiddleware);

// Middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación pública
app.use('/api/auth', authRoutes); 

// Rutas de foro/chat
app.use('/api/foro', chatRoutes); 

// Rutas de usuario, algunas de las cuales requieren autenticación
app.use('/api/users', userRoutes); 

//Rutas de notificaciones
app.use('/api/notificaciones', notificationRoutes);

//Rutas de Leaderboard
app.use('/api/leaderboards', leaderboardRoutes);

//Rutas de pagos/Stripe
app.use('/api/payments', paymentRoutes);

// Inicializar el manejador de Socket.IO
socketHandler(io);

// Servir el cliente de React en cualquier otra ruta
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

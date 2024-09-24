const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/futbol360', {
}).then(() => {
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
app.use(express.static('public'));  // Asegúrate de que el archivo index.html esté en /public

// Ruta para manejar el registro
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Crear un nuevo usuario
        const nuevoUsuario = new User({ username, email, password });
        await nuevoUsuario.save();
        res.send('Usuario registrado exitosamente.');
    } catch (err) {
        res.status(400).send('Error al registrar usuario: ' + err.message);
    }
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por correo
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send('Usuario no encontrado');
        }

        // Comparar las contraseñas
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).send('Contraseña incorrecta');
        }

        res.send('Inicio de sesión exitoso');
    } catch (err) {
        res.status(400).send('Error al iniciar sesión: ' + err.message);
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

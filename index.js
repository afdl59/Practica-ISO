// Importar las dependencias necesarias
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/futbol360')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
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

// Cifrar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

// Función para crear y guardar un nuevo usuario
const crearUsuario = async (username, email, password) => {
  const nuevoUsuario = new User({
    username,
    email,
    password,
  });

  try {
    const userGuardado = await nuevoUsuario.save();
    console.log('Usuario guardado:', userGuardado);
  } catch (err) {
    console.error('Error al guardar el usuario:', err);
  }
};

// Función para buscar un usuario por nombre de usuario
const buscarUsuario = async (username) => {
  try {
    const usuarioEncontrado = await User.findOne({ username });
    if (usuarioEncontrado) {
      console.log('Usuario encontrado:', usuarioEncontrado);
    } else {
      console.log('Usuario no encontrado');
    }
  } catch (err) {
    console.error('Error al buscar el usuario:', err);
  }
};

//Ejemplos de uso

// Crear un nuevo usuario
//crearUsuario('futbolfan123', 'futbolfan123@example.com', 'securepassword123');

// Buscar un usuario por su nombre de usuario
//buscarUsuario('futbolfan123');

// routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

const router = express.Router();

// Configuración de multer para subir imágenes de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Rutas de autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/check-session', userController.checkSession);
router.post('/logout', userController.logout);

// Rutas de perfil de usuario con verificación de sesión
router.get('/:username', authMiddleware, userController.getUserProfile); // Protege la ruta de obtener perfil
router.put('/:username', authMiddleware, userController.updateUserProfile); // Protege la ruta de actualizar perfil
router.post('/upload', authMiddleware, upload.single('fotoPerfil'), userController.uploadProfileImage); // Protege la ruta de subir imagen de perfil

module.exports = router;

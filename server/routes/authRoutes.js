const express = require('express');
const passport = require('../middleware/passport');
const { checkSession, handleOAuthSuccess, logout } = require('../controllers/authController');

const router = express.Router();

// Ruta de autenticación con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Callback de Google
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    handleOAuthSuccess // Usa el controlador para manejar el éxito de OAuth
);

// Cerrar sesión
router.get('/logout', logout);

// Ruta existente para verificar la sesión
router.get('/check-session', checkSession);

module.exports = router;



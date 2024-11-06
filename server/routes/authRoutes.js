// routes/authRoutes.js
const express = require('express');
const { register, login, checkSession } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-session', authMiddleware, checkSession);

module.exports = router;

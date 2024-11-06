// routes/authRoutes.js
const express = require('express');
const { checkSession } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/check-session', authMiddleware, checkSession);

module.exports = router;

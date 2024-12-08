const express = require('express');
const { createSession } = require('../controllers/stripeController');

const router = express.Router();

router.post('/create-session', createSession);

module.exports = router;

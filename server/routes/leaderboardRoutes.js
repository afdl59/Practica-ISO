// routes/leaderboardRoutes.js
const express = require('express');
const { getLeaderboards } = require('../controllers/leaderboardController');

const router = express.Router();

// GET /api/leaderboards
router.get('/', getLeaderboards);

module.exports = router;
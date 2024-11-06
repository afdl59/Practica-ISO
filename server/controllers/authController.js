// controllers/authController.js
exports.checkSession = (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isAuthenticated: true, username: req.session.user.username });
    } else {
        res.json({ isAuthenticated: false });
    }
};

// middleware/authMiddleware.js
console.log("Sesión actual:", req.session);
module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        next(); // El usuario está autenticado, continuar con la solicitud
    } else {
        res.status(401).json({ message: 'No autorizado' });
    }
};

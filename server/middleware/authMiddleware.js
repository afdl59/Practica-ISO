// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    console.log("Middleware Autenticacion, Sesión actual:", req.session);
    if (req.session) {
        next(); // El usuario está autenticado, continuar con la solicitud
    } else {
        res.status(401).json({ message: 'No autorizado' });
    }
};

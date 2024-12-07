// middleware/getIp.js
const requestIp = require('request-ip');

const getClientIp = (req, res, next) => {
    req.clientIp = requestIp.getClientIp(req); // Obtiene la IP del cliente
    next();
};

module.exports = getClientIp;

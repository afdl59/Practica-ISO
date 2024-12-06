// middleware/sessionMiddleware.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
        secure: process.env.NODE_ENV === 'production', // Solo true en producción
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    },
});


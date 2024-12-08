// controllers/authController.js

// Verificar si hay una sesión activa
exports.checkSession = (req, res) => {
    console.log("Sesion activa: ", req.session);
    if (req.session && req.session.userId) {
        return res.status(200).json({
            isAuthenticated: true,
            username: req.session.username,
        });
    } else {
        return res.status(401).json({ isAuthenticated: false });
    }
};

// Manejar la redirección después del inicio de sesión con OAuth
exports.handleOAuthSuccess = (req, res) => {
    if (req.user) {
        // Crear una sesión para el usuario
        req.session.userId = req.user.id;
        req.session.username = req.user.username;

        // Log para verificar la sesión
        console.log("Sesión creada tras OAuth:", req.session);

        // Guardar sesión explícitamente
        req.session.save((err) => {
            if (err) {
                console.error("Error al guardar la sesión:", err);
                return res.status(500).json({ message: "No se pudo guardar la sesión" });
            }
            res.redirect('/'); // Redirige al home o donde prefieras
        });
    } else {
        res.status(400).json({ message: "No se pudo autenticar al usuario." });
    }
};


// Cerrar sesión
exports.logout = (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Limpia la cookie de sesión
            res.redirect('/'); // Redirige al usuario
        });
    });
};

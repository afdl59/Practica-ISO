// socket.js
const Message = require('./models/Message');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}`);

        // Evento para unirse a una sala de chat
        socket.on('unirseASala', (salaId) => {
            socket.join(salaId);
            console.log(`Usuario se unió a la sala: ${salaId}`);
            
            // Escuchar evento de mensaje recibido en la sala
            socket.on('mensajeRecibido', (mensaje) => {
                console.log('Mensaje recibido en el servidor:', mensaje);
                io.to(salaId).emit('mensajeRecibido', mensaje);
            });
        });

        // Evento para recibir y guardar un nuevo mensaje en la base de datos
        socket.on('nuevoMensaje', async ({ chatRoom, username, content }) => {
            try {
                // Crear una nueva instancia de mensaje y guardarlo en la base de datos
                const nuevoMensaje = new Message({
                    content,
                    username,
                    chatRoom
                });
                await nuevoMensaje.save();
    
                // Emitir el mensaje a todos los usuarios en la sala de chat específica
                io.to(chatRoom).emit('mensajeRecibido', {
                    username,
                    content,
                    date: nuevoMensaje.date,
                    chatRoom
                });
    
                console.log(`Nuevo mensaje en la sala ${chatRoom}: ${content}`);
            } catch (err) {
                console.error('Error al enviar el mensaje:', err);
                socket.emit('error', 'Error al enviar el mensaje');
            }
        });

        // Evento para gestionar la desconexión del usuario
        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
};

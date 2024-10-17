

// Importar el cliente de Socket.IO
const socket = io();

// Escuchar el evento de mensajes recibidos
socket.on('mensajeRecibido', (mensaje) => {
    mostrarMensaje(mensaje);
});

// Función para cargar mensajes iniciales desde el backend
async function cargarMensajes() {
    const response = await fetch('/api/foro/mensajes');  // Hacemos una solicitud GET a la API
    const mensajes = await response.json();  // Convertimos la respuesta a formato JSON

    mensajes.forEach(mensaje => {
        mostrarMensaje(mensaje);  // Mostramos cada mensaje en el foro
    });
}

// Función para mostrar un mensaje en el foro
function mostrarMensaje(mensaje) {
    const foroDiv = document.getElementById('foro');
    const nuevoMensaje = `
        <div>
            <strong>${mensaje.username}</strong>: ${mensaje.content}
            <small style="float:right;">${new Date(mensaje.date).toLocaleString()}</small>
        </div>
        <hr/>
    `;
    foroDiv.innerHTML += nuevoMensaje;  // Agregamos el nuevo mensaje al contenedor del foro
    foroDiv.scrollTop = foroDiv.scrollHeight;  // Hacemos auto-scroll hacia abajo para mostrar el último mensaje
}

// Enviar un nuevo mensaje
document.getElementById('formMensaje').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const content = document.getElementById('content').value;

    // Emitir el evento de nuevo mensaje al servidor
    socket.emit('nuevoMensaje', { username, content });

    // Limpiar el campo de texto
    document.getElementById('content').value = '';
});

// Cargar los mensajes iniciales cuando la página cargue
cargarMensajes();
import React, { useState, useEffect } from 'react';
import '../../styles/foro/Foro.css';
import io from 'socket.io-client';
//prueba foro
let socket;

function Foro() {
  const [mensajes, setMensajes] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Obtener el usuario del localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    socket = io('https://futbol360.ddns.net');

    // Cargar mensajes iniciales
    const cargarMensajes = async () => {
      try {
        const response = await fetch('/api/foro/mensajes');
        const data = await response.json();
        setMensajes(data);
      } catch (error) {
        console.error('Error cargando los mensajes:', error);
      }
    };

    cargarMensajes();

    // Configurar Socket.io
    socket.on('mensajeRecibido', (mensaje) => {
      setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
    });

    // Limpiar socket cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && content) {
      const nuevoMensaje = { username, content, date: new Date() };
      socket.emit('nuevoMensaje', nuevoMensaje);
      setContent('');
      socket.on('mensajeRecibido', (mensaje) => {
        console.log('Nuevo mensaje recibido del servidor:', mensaje);
        setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
      });
      
    }
  };

  return (
    <div className="foro">
      <h1>Foro</h1>
      <div id="foro">
        {mensajes.length === 0 ? (
          <p>No hay mensajes aún. ¡Sé el primero en enviar uno!</p>
        ) : (
          mensajes.map((mensaje, index) => (
            <div key={index}>
              <strong>{mensaje.username}</strong>: {mensaje.content}
              <small style={{ float: 'right' }}>{new Date(mensaje.date).toLocaleString()}</small>
              <hr />
            </div>
          ))
        )}
      </div>
      <form id="formMensaje" onSubmit={handleSubmit}>
        <input
          id="content"
          type="text"
          placeholder="Mensaje"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Foro;

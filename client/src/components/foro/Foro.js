import React, { useState, useEffect } from 'react';
import '../../styles/foro/Foro.css';
import io from 'socket.io-client';

let socket;

function Foro() {
  const [salas, setSalas] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [currentSala, setCurrentSala] = useState(null);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Obtener el usuario del localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    socket = io('https://futbol360.ddns.net');

    // Cargar las salas de chat iniciales
    const cargarSalas = async () => {
      try {
        const response = await fetch('/api/foro/salas');
        const data = await response.json();
        setSalas(data);
      } catch (error) {
        console.error('Error cargando las salas:', error);
      }
    };

    cargarSalas();

    // Configurar Socket.IO para escuchar los mensajes nuevos
    socket.on('mensajeRecibido', (mensaje) => {
      if (mensaje.chatRoom === currentSala) {
        setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
      }
    });

    // Limpiar socket cuando el componente se desmonte
    return () => {
      socket.off('mensajeRecibido');
      socket.disconnect();
    };
  }, [currentSala]);

  const handleSalaSelect = async (salaId) => {
    setCurrentSala(salaId);

    // Unirse a la sala con Socket.IO
    socket.emit('unirseASala', salaId);

    // Cargar mensajes de la sala seleccionada
    try {
      const response = await fetch(`/api/foro/salas/${salaId}/mensajes`);
      const data = await response.json();
      setMensajes(data);
    } catch (error) {
      console.error('Error cargando los mensajes:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && content && currentSala) {
      const nuevoMensaje = { salaId: currentSala, userId: username, content, date: new Date() };
      // Emitir el evento de nuevo mensaje al servidor
      socket.emit('nuevoMensaje', nuevoMensaje);
      setContent(''); // Limpiar el campo de texto
    }
  };

  return (
    <div className="foro">
      <h1>Foro</h1>

      <div className="salas-lista">
        <h2>Salas de Chat</h2>
        {salas.length === 0 ? (
          <p>No hay salas disponibles.</p>
        ) : (
          salas.map((sala) => (
            <div key={sala._id} onClick={() => handleSalaSelect(sala._id)} className="sala">
              <h3>{sala.title}</h3>
              <p>{sala.description}</p>
            </div>
          ))
        )}
      </div>

      {currentSala && (
        <>
          <div id="foro">
            {mensajes.length === 0 ? (
              <p>No hay mensajes en esta sala aún. ¡Sé el primero en enviar uno!</p>
            ) : (
              mensajes.map((mensaje, index) => (
                <div key={index}>
                  <strong>{mensaje.user.username}</strong>: {mensaje.content}
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
        </>
      )}
    </div>
  );
}

export default Foro;

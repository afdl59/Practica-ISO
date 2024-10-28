import React, { useState, useEffect } from 'react';
import '../../styles/foro/Foro.css';
import io from 'socket.io-client';

function Foro() {
  const [mensajes, setMensajes] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [salas, setSalas] = useState([]); // Almacena las salas disponibles
  const [currentSala, setCurrentSala] = useState(''); // Almacena la sala seleccionada
  const [newSala, setNewSala] = useState(''); // Almacena el nombre de la nueva sala

  // Inicializar la conexión de Socket.IO
  const socket = io('https://futbol360.ddns.net');

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Verificar si el usuario está autenticado
        const response = await fetch('/api/check-session');
        const data = await response.json();

        if (!data.isAuthenticated) {
          navigate('/login'); // Redirige al login si no está autenticado
          return;
        }

        setUsername(data.username);

        // Cargar las salas de chat iniciales
        const responseSalas = await fetch('/api/foro/salas');
        const dataSalas = await responseSalas.json();
        setSalas(dataSalas);
      } catch (error) {
        console.error('Error verificando la sesión o cargando las salas:', error);
        navigate('/login');
      }
    };

    checkAuthAndLoadData();

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

  const handleSalaChange = (sala) => {
    setCurrentSala(sala);
    setMensajes([]); // Limpiar mensajes cuando se cambia de sala
  };

  const handleCreateSala = async (e) => {
    e.preventDefault();
    if (newSala) {
      try {
        const response = await fetch('/api/foro/salas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre: newSala }),
        });

        if (response.ok) {
          const nuevaSala = await response.json();
          setSalas((prevSalas) => [...prevSalas, nuevaSala]);
          setNewSala(''); // Limpiar el campo de texto
        }
      } catch (error) {
        console.error('Error creando la nueva sala:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && content && currentSala) {
      const nuevoMensaje = { username, content, chatRoom: currentSala, date: new Date() };
      // Emitir el evento de nuevo mensaje al servidor
      socket.emit('nuevoMensaje', nuevoMensaje);
      setContent(''); // Limpiar el campo de texto
    }
  };

  return (
    <>
      <h1>Foro</h1>
      <div className="salas">
        <h2>Salas de chat</h2>
        {salas.length === 0 ? (
          <p>No hay salas disponibles. ¡Crea una nueva!</p>
        ) : (
          salas.map((sala, index) => (
            <button key={index} onClick={() => handleSalaChange(sala.nombre)}>
              {sala.nombre}
            </button>
          ))
        )}
        <form onSubmit={handleCreateSala}>
          <input
            type="text"
            placeholder="Nueva sala"
            value={newSala}
            onChange={(e) => setNewSala(e.target.value)}
            required
          />
          <button type="submit">Crear Sala</button>
        </form>
      </div>
      <div className="foro">
        <h2>Sala: {currentSala}</h2>
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
    </>
  );
}

export default Foro;

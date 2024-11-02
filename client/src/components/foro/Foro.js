import React, { useState, useEffect, useRef } from 'react';
import '../../styles/foro/Foro.css';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function Foro() {
  const [mensajes, setMensajes] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [salas, setSalas] = useState([]);
  const [currentSala, setCurrentSala] = useState('');
  const [newSalaTitle, setNewSalaTitle] = useState('');
  const [newSalaDescription, setNewSalaDescription] = useState('');
  const navigate = useNavigate();
  
  // Utiliza useRef para que `socket` permanezca constante en todas las renderizaciones
  const socket = useRef(null);

  // Configurar la conexión de Socket.IO una sola vez al montar el componente
  useEffect(() => {
    socket.current = io('https://futbol360.ddns.net');

    socket.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    // Configurar Socket.IO para escuchar los mensajes nuevos
    socket.current.on('mensajeRecibido', (mensaje) => {
      console.log('Mensaje recibido:', mensaje);
      console.log('Sala actual:', currentSala);
      if (mensaje.chatRoom === currentSala) {
          setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
      }
    });

    // Limpiar socket cuando el componente se desmonte
    return () => {
      socket.current.off('mensajeRecibido');
      socket.current.disconnect();
      console.log('Socket desconectado');
    };
  }, []); // Solo ejecutado una vez al montar el componente

  // useEffect para manejar cambios en `currentSala`
  useEffect(() => {
    if (currentSala) {
      console.log('Cambiando a sala:', currentSala);
      setMensajes([]); // Limpiar mensajes cuando se cambia de sala

      // Emitir evento de unirse a la nueva sala
      socket.current.emit('unirseASala', currentSala);

      // Cargar mensajes de la nueva sala
      const fetchMensajes = async () => {
        try {
          const responseMensajes = await fetch(`/api/foro/salas/${currentSala}/mensajes`);
          if (responseMensajes.ok) {
            const dataMensajes = await responseMensajes.json();
            setMensajes(dataMensajes);
          } else {
            console.warn('No se encontraron mensajes en la sala.');
          }
        } catch (error) {
          console.error('Error al cargar los mensajes de la sala:', error);
        }
      };
      
      fetchMensajes();
    }
  }, [currentSala]); // Ejecutado cada vez que `currentSala` cambia

  const handleSalaChange = (sala) => {
    setCurrentSala(sala._id);
  };

  const handleCreateSala = async (e) => {
    e.preventDefault();
    if (newSalaTitle && newSalaDescription && username) {
      console.log(newSalaTitle, newSalaDescription, username);
      try {
        const response = await fetch('https://futbol360.ddns.net/api/foro/salas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newSalaTitle,
            description: newSalaDescription,
            createdBy: username,
          }),
        });

        if (response.ok) {
          const nuevaSala = await response.json();
          setSalas((prevSalas) => [...prevSalas, nuevaSala.newChatRoom]);
          setNewSalaTitle('');
          setNewSalaDescription('');
        } else {
          console.error('Error al crear la nueva sala:', response.statusText);
        }
      } catch (error) {
        console.error('Error creando la nueva sala:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && content && currentSala) {
      const nuevoMensaje = { 
        username: username, 
        content: content, 
        chatRoom: currentSala 
      };
      console.log('Enviando mensaje:', nuevoMensaje);
      socket.current.emit('nuevoMensaje', nuevoMensaje);
      setContent('');
    }
  };

  return (
    <>
      <h1>Foro</h1>
      <div className="salas">
        <h2>Salas de chat</h2>
        {salas.length === 0 ? (
          <>
            <p>No hay salas disponibles. ¡Crea una nueva!</p>
            <form onSubmit={handleCreateSala}>
              <input
                type="text"
                placeholder="Título de la nueva sala"
                value={newSalaTitle}
                onChange={(e) => setNewSalaTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Descripción de la nueva sala"
                value={newSalaDescription}
                onChange={(e) => setNewSalaDescription(e.target.value)}
                required
              />
              <button type="submit">Crear Sala</button>
            </form>
          </>
        ) : (
          <>
            {salas.map((sala) => (
              <button key={sala._id} onClick={() => handleSalaChange(sala)}>
                {sala.title}
              </button>
            ))}
            <form onSubmit={handleCreateSala}>
              <input
                type="text"
                placeholder="Título de la nueva sala"
                value={newSalaTitle}
                onChange={(e) => setNewSalaTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Descripción de la nueva sala"
                value={newSalaDescription}
                onChange={(e) => setNewSalaDescription(e.target.value)}
                required
              />
              <button type="submit">Crear Sala</button>
            </form>
          </>
        )}
      </div>
      {currentSala && (
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
      )}
    </>
  );
}

export default Foro;

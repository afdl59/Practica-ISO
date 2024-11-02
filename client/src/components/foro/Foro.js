import React, { useState, useEffect } from 'react';
import '../../styles/foro/Foro.css';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function Foro() {
  const [mensajes, setMensajes] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [salas, setSalas] = useState([]); // Lista de salas disponibles
  const [currentSala, setCurrentSala] = useState(''); // Sala seleccionada
  const [newSalaTitle, setNewSalaTitle] = useState(''); // Título para una nueva sala
  const [newSalaDescription, setNewSalaDescription] = useState(''); // Descripción para la nueva sala
  const navigate = useNavigate();
  
  // Inicializar la conexión de Socket.IO
  const socket = io('https://futbol360.ddns.net');

  useEffect(() => { 
    const checkAuthAndLoadData = async () => {
      try {
        // Verificar si el usuario está autenticado
        console.log('Verificando autenticación...');
        const response = await fetch('/api/check-session', {
          headers: {
            'Cache-Control': 'no-cache', // Evitar el caché en la solicitud
          }
        });
        const textData = await response.text(); // Primero obtenemos el texto en lugar de JSON para identificar si hay un error de formato

        try {
          const data = JSON.parse(textData); // Intentamos parsear la respuesta como JSON
          console.log('Respuesta de /api/check-session:', data);

          if (!data.isAuthenticated) {
            console.warn('Usuario no autenticado, redirigiendo al login.');
            navigate('/login'); // Redirige al login si no está autenticado
            return;
          }

          setUsername(data.username);
        } catch (jsonError) {
          console.error('Error al parsear la respuesta de /api/check-session:', jsonError);
          console.error('Contenido de la respuesta:', textData);
          navigate('/login');
          return;
        }

        // Cargar las salas de chat iniciales
        console.log('Cargando salas de chat...');
        const responseSalas = await fetch('/api/foro/salas', {
          headers: {
            'Cache-Control': 'no-cache', // Evitar el caché en la solicitud
          }
        });

        // Verificar el estado de la respuesta para manejar los códigos HTTP
        if (responseSalas.status === 304) {
          console.warn('No hay cambios en las salas de chat desde la última solicitud.');
          return; // No actualizar si no hay cambios
        } else if (!responseSalas.ok) {
          console.warn('Error al cargar las salas de chat. Código de estado:', responseSalas.status);
          return;
        }

        const textSalas = await responseSalas.text(); // Primero obtenemos el texto para identificar cualquier problema

        try {
          const dataSalas = JSON.parse(textSalas);
          console.log('Respuesta de /api/foro/salas:', dataSalas);

          if (Array.isArray(dataSalas)) {
            setSalas(dataSalas);
          } else {
            console.warn('La respuesta de /api/foro/salas no es un array válido.');
          }
        } catch (jsonSalasError) {
          console.error('Error al parsear la respuesta de /api/foro/salas:', jsonSalasError);
          console.error('Contenido de la respuesta:', textSalas);
        }
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


  const handleSalaChange = async (sala) => {
    setCurrentSala(sala._id);
    setMensajes([]); // Limpiar mensajes cuando se cambia de sala

    // Unirse a la nueva sala con Socket.IO
    socket.emit('unirseASala', sala._id);

    // Cargar mensajes de la nueva sala
    try {
      const responseMensajes = await fetch(`/api/foro/salas/${sala._id}/mensajes`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && content && currentSala) {
      const nuevoMensaje = { 
        username: username, 
        content: content, 
        chatRoom: currentSala 
      };
      console.log('Enviando mensaje:', nuevoMensaje);
  
      try {
        const response = await fetch(`/api/foro/salas/${currentSala}/mensajes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoMensaje)
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Mensaje registrado:', data);
          setMensajes((prevMensajes) => [...prevMensajes, data.newMessage]);
        } else {
          console.error('Error al registrar el mensaje:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
  
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
        </div>
      )}
    </>
  );
}

export default Foro;

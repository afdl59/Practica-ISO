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
  const [currentSalaName, setCurrentSalaName] = useState('');
  const [newSalaTitle, setNewSalaTitle] = useState('');
  const [newSalaDescription, setNewSalaDescription] = useState('');
  const [newSalaCategory, setNewSalaCategory] = useState(''); // Nueva categoría
  const [search, setSearch] = useState(''); // Estado para el buscador
  const navigate = useNavigate();

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('https://futbol360.ddns.net');

    socket.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    return () => {
      socket.current.off('mensajeRecibido');
      socket.current.disconnect();
      console.log('Socket desconectado');
    };
  }, []);

  useEffect(() => {
    const handleMensajeRecibido = (mensaje) => {
      if (mensaje.chatRoom === currentSala) {
        setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
      }
    };

    socket.current.on('mensajeRecibido', handleMensajeRecibido);

    return () => {
      socket.current.off('mensajeRecibido', handleMensajeRecibido);
    };
  }, [currentSala]);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        const textData = await response.text();

        try {
          const data = JSON.parse(textData);
          if (!data.isAuthenticated) {
            navigate('/login');
            return;
          }
          setUsername(data.username);
        } catch {
          navigate('/login');
          return;
        }

        const responseSalas = await fetch('/api/foro/salas', {
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (responseSalas.ok) {
          const dataSalas = await responseSalas.json();
          setSalas(dataSalas);
        }
      } catch {
        navigate('/login');
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  useEffect(() => {
    if (currentSala) {
      setMensajes([]);
      socket.current.emit('unirseASala', currentSala);

      const fetchMensajes = async () => {
        const responseMensajes = await fetch(`/api/foro/salas/${currentSala}/mensajes`);
        if (responseMensajes.ok) {
          const dataMensajes = await responseMensajes.json();
          setMensajes(dataMensajes);
        }
      };

      fetchMensajes();
    }
  }, [currentSala]);

  const handleSalaChange = (sala) => {
    setCurrentSala(sala._id);
    setCurrentSalaName(sala.title);
  };

  const handleCreateSala = async (e) => {
    e.preventDefault();
    if (newSalaTitle && newSalaDescription && newSalaCategory && username) {
      try {
        const response = await fetch('https://futbol360.ddns.net/api/foro/salas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newSalaTitle,
            description: newSalaDescription,
            category: newSalaCategory,
            createdBy: username,
          }),
        });

        if (response.ok) {
          const nuevaSala = await response.json();
          setSalas((prevSalas) => [...prevSalas, nuevaSala.newChatRoom]);
          setNewSalaTitle('');
          setNewSalaDescription('');
          setNewSalaCategory('');
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
        username,
        content,
        chatRoom: currentSala,
      };

      socket.current.emit('nuevoMensaje', nuevoMensaje);
      setContent('');
    }
  };

  const filteredSalas = salas.filter((sala) =>
    sala.title.toLowerCase().includes(search.toLowerCase()) ||
    sala.description.toLowerCase().includes(search.toLowerCase()) ||
    sala.createdBy.toLowerCase().includes(search.toLowerCase())
  );

  const groupMessagesByDate = () => {
    return mensajes.reduce((acc, mensaje) => {
      const date = new Date(mensaje.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(mensaje);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="foro-contenedor">
      <div className="barra-lateral">
        <input
          type="text"
          placeholder="Buscar salas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="lista-salas">
          {salas
            .filter((sala) =>
              sala.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((sala) => (
              <button
                key={sala._id}
                onClick={() => handleSalaChange(sala)}
                className={sala._id === currentSala ? 'sala-activa' : ''}
              >
                <strong>{sala.title}</strong>
                <small>{sala.description}</small>
              </button>
            ))}
        </div>
        <form onSubmit={handleCreateSala}>
          <input
            type="text"
            placeholder="Título"
            value={newSalaTitle}
            onChange={(e) => setNewSalaTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newSalaDescription}
            onChange={(e) => setNewSalaDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newSalaCategory}
            onChange={(e) => setNewSalaCategory(e.target.value)}
            required
          />
          <button type="submit">Crear Sala</button>
        </form>
      </div>
      {currentSala && (
        <div className="sala-chat">
          <h2>{currentSalaName}</h2>
          <div className="mensajes">
            {Object.keys(groupedMessages).map((date) => (
              <div key={date}>
                <div className="fecha">{date}</div>
                {groupedMessages[date].map((mensaje, index) => (
                  <div
                    key={index}
                    className={
                      mensaje.username === username ? 'mensaje propio' : 'mensaje ajeno'
                    }
                  >
                    <div className="contenido">{mensaje.content}</div>
                    <div className="hora">
                      {new Date(mensaje.date).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <form className="enviar-mensaje" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Foro;



/* ANTIGUO FORO
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

  // Mantener una referencia única para la conexión de Socket.IO
  const socket = useRef(null);

  // Conectar a Socket.IO solo una vez al montar el componente
  useEffect(() => {
    socket.current = io('https://futbol360.ddns.net');

    socket.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    // Limpiar la conexión de Socket.IO al desmontar el componente
    return () => {
      socket.current.off('mensajeRecibido');
      socket.current.disconnect();
      console.log('Socket desconectado');
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  // Manejar mensajes recibidos
  useEffect(() => {
    const handleMensajeRecibido = (mensaje) => {
      console.log('Mensaje recibido en el cliente:', mensaje);
      if (mensaje.chatRoom === currentSala) {
        setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
      }
    };
  
    socket.current.on('mensajeRecibido', handleMensajeRecibido);
  
    // Limpiar el evento 'mensajeRecibido' al cambiar de sala o desmontar el componente
    return () => {
      socket.current.off('mensajeRecibido', handleMensajeRecibido);
    };
  }, [currentSala]);

  // Verificación de autenticación y carga inicial de datos
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Verificar si el usuario está autenticado
        const response = await fetch('/api/auth/check-session', {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const textData = await response.text();

        try {
          const data = JSON.parse(textData);
          if (!data.isAuthenticated) {
            navigate('/login'); // Redirige al login si no está autenticado
            return;
          }
          setUsername(data.username);
        } catch (jsonError) {
          console.error('Error al parsear la respuesta de /api/check-session:', jsonError);
          navigate('/login');
          return;
        }

        // Cargar las salas de chat
        const responseSalas = await fetch('/api/foro/salas', {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (responseSalas.ok) {
          const dataSalas = await responseSalas.json();
          setSalas(dataSalas);
        } else {
          console.warn('Error al cargar las salas de chat.');
        }
      } catch (error) {
        console.error('Error verificando la sesión o cargando las salas:', error);
        navigate('/login');
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  // Manejar cambio de sala
  useEffect(() => {
    if (currentSala) {
      setMensajes([]); // Limpiar mensajes cuando se cambia de sala
      socket.current.emit('unirseASala', currentSala);

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
  }, [currentSala]);

  const handleSalaChange = (sala) => {
    setCurrentSala(sala._id);
  };

  const handleCreateSala = async (e) => {
    e.preventDefault();
    if (newSalaTitle && newSalaDescription && username) {
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
          console.error('Error al crear la nueva sala.');
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
        chatRoom: currentSala,
      };

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
                  <strong>{mensaje.username || mensaje.user}</strong>: {mensaje.content}
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
*/
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/foro/Foro.css';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function Foro() {
  const [mensajes, setMensajes] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [profilePictures, setProfilePictures] = useState({});
  const [salas, setSalas] = useState([]);
  const [currentSala, setCurrentSala] = useState('');
  const [currentSalaName, setCurrentSalaName] = useState('');
  const [newSalaTitle, setNewSalaTitle] = useState('');
  const [newSalaDescription, setNewSalaDescription] = useState('');
  const [newSalaCategory, setNewSalaCategory] = useState(''); // Nueva categoría
  const [search, setSearch] = useState(''); // Estado para el buscador
  const [showPopup, setShowPopup] = useState(false);
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
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        if (response.ok) {
          const sessionData = await response.json();
          setUsername(sessionData.username);
  
          // Obtener foto de perfil del usuario actual
          const userProfileResponse = await fetch(`/api/users/${sessionData.username}`);
          if (userProfileResponse.ok) {
            const userProfile = await userProfileResponse.json();
            setProfilePictures((prev) => ({
              ...prev,
              [sessionData.username]: userProfile.fotoPerfil || '/uploads/default-profile.png',
            }));
          }
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };
  
    fetchUserProfile();
  }, []);  

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

  useEffect(() => {
    // Cargar las fotos de perfil de todos los usuarios relevantes
    const loadProfilePictures = async () => {
      try {
        // Obtener la foto de perfil del usuario actual
        const response = await fetch(`/api/users/${username}`);
        if (response.ok) {
          const userData = await response.json();
          setProfilePictures((prev) => ({
            ...prev,
            [username]: userData.fotoPerfil || '/uploads/default-profile.png',
          }));
        }
  
        // Obtener las fotos de perfil de otros usuarios en los mensajes
        const uniqueUsernames = [...new Set(mensajes.map((msg) => msg.username))];
        for (const user of uniqueUsernames) {
          if (!profilePictures[user]) {
            const res = await fetch(`/api/users/${user}`);
            if (res.ok) {
              const userInfo = await res.json();
              setProfilePictures((prev) => ({
                ...prev,
                [user]: userInfo.fotoPerfil || '/uploads/default-profile.png',
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar las fotos de perfil:', error);
      }
    };
  
    if (username && mensajes.length > 0) {
      loadProfilePictures();
    }
  }, [username, mensajes, profilePictures]);  

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
          setShowPopup(false);
        }
      } catch (error) {
        console.error('Error creando la nueva sala:', error);
      }
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup); // Alternar entre mostrar y ocultar el popup
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

  const groupMessagesByDateAndUser = () => {
    const groupedByDate = mensajes.reduce((acc, mensaje) => {
      const date = new Date(mensaje.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(mensaje);
      return acc;
    }, {});
  
    return Object.entries(groupedByDate).map(([date, messages]) => {
      const groupedByUser = [];
      let currentGroup = null;
  
      messages.forEach((mensaje) => {
        if (!currentGroup || currentGroup.username !== mensaje.username) {
          currentGroup = { username: mensaje.username, messages: [], profilePicture: mensaje.profilePicture };
          groupedByUser.push(currentGroup);
        }
        currentGroup.messages.push(mensaje);
      });
  
      return { date, groups: groupedByUser };
    });
  };
  
  const groupedMessages = groupMessagesByDateAndUser();
  
  return (
    <div className="foro-contenedor">
      <div className="barra-lateral">
        <div className="barra-superior">
          <input
            type="text"
            placeholder="Buscar salas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="boton-crear-sala" onClick={togglePopup}>
            + Crear Sala
          </button>
        </div>
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
      </div>
      {currentSala && (
        <div className="sala-chat">
          <h2>{currentSalaName}</h2>
          <div className="mensajes">
            {groupedMessages.map(({ date, groups }, index) => (
              <div key={index} className="grupo-fecha">
                <div className="fecha">{date}</div>
                {groups.map((group, idx) => (
                  <div key={idx} className="grupo-mensajes">
                    <div className="info-usuario">
                      <img
                        src={profilePictures[group.username] || '/uploads/default-profile.png'}
                        alt={group.username}
                        className="foto-perfil"
                      />
                      <strong>{group.username}</strong>
                    </div>
                    {group.messages.map((mensaje, i) => (
                      <div
                        key={i}
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
      {showPopup && (
        <div className="popup-crear-sala">
          <div className="popup-contenido">
            <h3>Crear Nueva Sala</h3>
            <form onSubmit={handleCreateSala}>
              <input
                type="text"
                placeholder="Título de la sala"
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
              <button type="submit">Crear</button>
              <button type="button" onClick={togglePopup}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );  
}

export default Foro;

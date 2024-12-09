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
  const [currentSalaDescription, setCurrentSalaDescription] = useState('');
  const [currentSalaCreatedBy, setCurrentSalaCreatedBy] = useState('');
  const [newSalaTitle, setNewSalaTitle] = useState('');
  const [newSalaDescription, setNewSalaDescription] = useState('');
  const [newSalaCategory, setNewSalaCategory] = useState('');

  const [search, setSearch] = useState('');

  const [showCreateSalaPopup, setCreateSalaPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const [userList, setUserList] = useState([]); // Lista de usuarios cargados
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    const checkAuthAndLoadData = async () => {
      try {
        // Verificar sesión del usuario
        const response = await fetch('/api/auth/check-session', {
          method: 'GET', // Método GET para verificar sesión
          headers: { 'Cache-Control': 'no-cache' },
        });
        const sessionData = await response.json();
  
        if (!sessionData.isAuthenticated) {
          navigate('/login');
          return;
        }
  
        setUsername(sessionData.username);
  
        // Obtener la lista de salas
        const salasResponse = await fetch('/api/foro/salas', {
          method: 'GET', // Método GET para obtener todas las salas
          headers: { 'Cache-Control': 'no-cache' },
        });
        const salasData = await salasResponse.json();
        setSalas(salasData);

        // Cargar lista de usuarios
        const usersResponse = await fetch('/api/users/getall', { method: 'GET' });
        setUserList(await usersResponse.json());

      } catch (error) {
        console.error('Error al verificar sesión:', error);
        navigate('/login');
      }
    };
  
    checkAuthAndLoadData();
  }, [navigate]);
  
  useEffect(() => {
    if (currentSala) {
      const fetchSalaData = async () => {
        try {
          // Obtener mensajes y datos de la sala de manera paralela
          const [mensajesRes, salaRes] = await Promise.all([
            fetch(`/api/foro/salas/${currentSala}/mensajes`, {
              method: 'GET', // Método GET para obtener los mensajes de la sala actual
            }),
            fetch(`/api/foro/salas/${currentSala}`, {
              method: 'GET', // Método GET para obtener los detalles de la sala actual
            }),
          ]);
  
          if (mensajesRes.ok && salaRes.ok) {
            const mensajesData = await mensajesRes.json();
            const salaData = await salaRes.json();
  
            setMensajes(mensajesData);
            setCurrentSalaName(salaData.title);
            setCurrentSalaDescription(salaData.description);
            setCurrentSalaCreatedBy(salaData.createdBy);
  
            // Cargar fotos de perfil de los usuarios en los mensajes
            const uniqueUsernames = [...new Set(mensajesData.map((msg) => msg.username))];
            const missingProfiles = uniqueUsernames.filter((user) => !profilePictures[user]);
  
            if (missingProfiles.length > 0) {
              const profileResponses = await Promise.all(
                missingProfiles.map((user) =>
                  fetch(`/api/users/${user}`, {
                    method: 'GET', // Método GET para obtener fotos de perfil de usuarios
                  })
                )
              );
  
              const profileData = await Promise.all(profileResponses.map((res) => res.json()));
              const newProfiles = profileData.reduce((acc, profile, index) => {
                acc[missingProfiles[index]] = profile.fotoPerfil || '/uploads/default-profile.png';
                return acc;
              }, {});
  
              setProfilePictures((prev) => ({ ...prev, ...newProfiles }));
            }
          }
        } catch (error) {
          console.error('Error al cargar datos de la sala:', error);
        }
      };
  
      socket.current.emit('unirseASala', currentSala);
      fetchSalaData();
    }
  }, [currentSala, profilePictures]);  

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
          setCreateSalaPopup(false);
        }
      } catch (error) {
        console.error('Error creando la nueva sala:', error);
      }
    }
  };

  const handleEditSala = async () => {
    try {
      await fetch(`/api/foro/salas/${currentSala}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentSalaName,
          description: currentSalaDescription,
        }),
      });
      alert('Sala actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando la sala:', error);
    }
  };

  const handleClearMessages = async () => {
    try {
      await fetch(`/api/foro/salas/${currentSala}/mensajes`, {
        method: 'DELETE',
      });
      setMensajes([]);
      alert('Mensajes eliminados correctamente');
    } catch (error) {
      console.error('Error eliminando los mensajes:', error);
    }
  };

  const handleDeleteSala = async () => {
    try {
      await fetch(`/api/foro/salas/${currentSala}`, {
        method: 'DELETE',
      });
      setSalas((prevSalas) => prevSalas.filter((sala) => sala._id !== currentSala));
      setCurrentSala('');
      setMensajes([]);
      alert('Sala eliminada correctamente');
    } catch (error) {
      console.error('Error eliminando la sala:', error);
    }
  };

  // Filtrar usuarios al escribir menciones
  const handleInputChange = (e) => {
    const value = e.target.value;
    setContent(value);

    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const matches = userList.filter((user) =>
        user.username.toLowerCase().startsWith(query)
      );
      setFilteredUsers(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Insertar la mención en el mensaje
  const handleUserSelect = (username) => {
    setContent((prev) => prev.replace(/@\w*$/, `@${username} `));
    setShowSuggestions(false);
  };

   // Manejar envío de mensajes
   const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && content && currentSala) {
      let messageContent = content;

      // Si hay una mención incompleta, selecciona automáticamente la primera coincidencia
      const mentionMatch = content.match(/@(\w*)$/);
      if (mentionMatch && filteredUsers.length > 0) {
        const firstMatch = filteredUsers[0].username;
        messageContent = content.replace(/@\w*$/, `@${firstMatch}`);
      }

      const nuevoMensaje = {
        username,
        content: messageContent,
        chatRoom: currentSala,
      };

      socket.current.emit('nuevoMensaje', nuevoMensaje);

      // Enviar notificaciones a usuarios mencionados
      const mentions = messageContent.match(/@(\w+)/g);
      if (mentions) {
        for (const mention of mentions) {
          const mentionedUser = mention.substring(1); // Elimina el '@'
          try {
            await fetch(`/api/notificaciones/${mentionedUser}`, { method: 'POST', type: 'foro' });
          } catch (error) {
            console.error(`Error al enviar notificación a ${mentionedUser}:`, error);
          }
        }
      }

      setContent('');
    }
  };  

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

  // Ordenar las salas por la fecha del último mensaje
  const sortedSalas = salas.sort((a, b) => {
    const dateA = new Date(a.lastMessageDate || a.createdAt).getTime();
    const dateB = new Date(b.lastMessageDate || b.createdAt).getTime();
    return dateB - dateA; // Orden descendente
  });

  return(
    <div className="foro-contenedor">
      <div className="barra-lateral">
        <div className="barra-superior">
          <input
            type="text"
            placeholder="Buscar salas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="boton-crear-sala" onClick={() => setCreateSalaPopup(true)}>
            Crear Sala
          </button>
        </div>
        <div className="lista-salas">
          {sortedSalas
            .filter((sala) =>
              sala.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((sala) => (
              <div
                key={sala._id}
                className={`sala-item ${sala._id === currentSala ? 'sala-activa' : ''}`}
                onClick={() => setCurrentSala(sala._id)}
              >
                <div className="sala-info">
                  <strong>{sala.title}</strong>
                  <small>Creada por {sala.createdBy}</small>
                  <small>
                    Último mensaje:{' '}
                    {new Date(sala.lastMessageDate || sala.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="sala-chat">
        {currentSala && (
          <>
            <div className="header-sala">
              <div className="info-sala">
                <h2>{currentSalaName}</h2>
                <p className="descripcion-sala">{currentSalaDescription}</p>
              </div>
              {currentSalaCreatedBy === username && (
                <button
                  className="boton-ajustes"
                  onClick={() => setShowSettingsPopup(true)}
                >
                  <i className="fa fa-cog"></i>
                </button>
              )}
            </div>

            <div className="mensajes">
              {groupedMessages.map(({ date, groups }, index) => (
                <div key={index} className="grupo-fecha">
                  <div className="fecha">{date}</div>
                  {groups.map((group, idx) => (
                    <div key={idx} className="grupo-mensajes">
                      <div className="info-usuario">
                        <div className="avatar">
                          <img
                            src={profilePictures[group.username] || '/uploads/default-profile.png'}
                            alt={group.username}
                          />
                        </div>
                        <strong>{group.username}</strong>
                      </div>
                      {group.messages.map((mensaje, i) => (
                        <div
                          key={i}
                          className={`mensaje ${
                            mensaje.username === username ? 'propio' : 'ajeno'
                          }`}
                        >
                          <div className="contenido">
                            {mensaje.content}
                            <div className="hora">
                              {new Date(mensaje.date).toLocaleTimeString()}
                            </div>
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
                onChange={handleInputChange}
                required
              />
              <button type="submit">Enviar</button>
            </form>
            {showSuggestions && (
              <ul className="user-suggestions">
                {filteredUsers.map((user) => (
                  <li key={user.username} onClick={() => handleUserSelect(user.username)}>
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {showSettingsPopup && (
        <div className="popup-ajustes">
          <div className="popup-contenido">
            <h3>Ajustes de Sala</h3>
            <input
              type="text"
              placeholder="Editar nombre de la sala"
              value={currentSalaName}
              onChange={(e) => setCurrentSalaName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Editar descripción"
              value={currentSalaDescription}
              onChange={(e) => setCurrentSalaDescription(e.target.value)}
            />
            <button onClick={handleEditSala}>Guardar Cambios</button>
            <button onClick={handleClearMessages}>Limpiar Mensajes</button>
            <button onClick={handleDeleteSala}>Eliminar Sala</button>
            <button onClick={() => setShowSettingsPopup(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showCreateSalaPopup && (
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
              <button type="button" onClick={() => setCreateSalaPopup(false)}>
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
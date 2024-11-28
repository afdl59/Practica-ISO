import React, { useEffect, useState } from 'react';

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Simula la llamada al API
    fetch(`/api/notificaciones/${localStorage.getItem('userId')}`)
      .then(res => res.json())
      .then(data => setNotificaciones(data))
      .catch(err => console.error('Error fetching notifications:', err));
  }, []);

  return (
    <div className="notificaciones">
      <h2>Notificaciones</h2>
      <ul>
        {notificaciones.length > 0 ? (
          notificaciones.map((notificacion, index) => (
            <li key={index}>{notificacion}</li>
          ))
        ) : (
          <p>No tienes notificaciones nuevas.</p>
        )}
      </ul>
    </div>
  );
}

export default Notificaciones;

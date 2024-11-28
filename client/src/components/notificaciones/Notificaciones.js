import React, { useEffect, useState } from 'react';

function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Asume que tienes el ID del usuario en el almacenamiento local

        fetch(`/api/notificaciones/${userId}`)
            .then(res => res.json())
            .then(data => setNotificaciones(data))
            .catch(err => console.error('Error fetching notifications:', err));
    }, []);

    const marcarComoLeida = (id) => {
        fetch(`/api/notificaciones/marcar-leida/${id}`, {
            method: 'PATCH',
        })
            .then(res => res.json())
            .then(() => {
                setNotificaciones(notificaciones.map(notificacion =>
                    notificacion._id === id ? { ...notificacion, isRead: true } : notificacion
                ));
            })
            .catch(err => console.error('Error marking notification as read:', err));
    };

    return (
        <div className="notificaciones">
            <h2>Notificaciones</h2>
            <ul>
                {notificaciones.length > 0 ? (
                    notificaciones.map(({ _id, content, isRead }) => (
                        <li key={_id} style={{ opacity: isRead ? 0.5 : 1 }}>
                            {content}
                            {!isRead && (
                                <button onClick={() => marcarComoLeida(_id)}>
                                    Marcar como leída
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No tienes notificaciones nuevas.</p>
                )}
            </ul>
        </div>
    );
}

export default Notificaciones;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica la sesión y obtiene el username
        fetch('/api/auth/check-session')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Usuario no autenticado');
                }
            })
            .then((data) => {
                const username = data.username; // Obtiene el username del endpoint

                // Llama al endpoint de notificaciones
                return fetch(`/api/notificaciones/${username}`)
                    .then((res) => res.json())
                    .then((notificaciones) => {
                        setNotificaciones(notificaciones);
                        setIsLoading(false);
                    });
            })
            .catch((err) => {
                console.error('Error verificando sesión o cargando notificaciones:', err);
                navigate('/login'); // Redirige al login si no está autenticado
            });
    }, [navigate]);

    const marcarComoLeida = (id) => {
        fetch(`/api/notificaciones/marcar-leida/${id}`, {
            method: 'PATCH',
        })
            .then((res) => res.json())
            .then(() => {
                setNotificaciones(notificaciones.map(notificacion =>
                    notificacion._id === id ? { ...notificacion, isRead: true } : notificacion
                ));
            })
            .catch((err) => console.error('Error marcando notificación como leída:', err));
    };

    if (isLoading) {
        return <p>Cargando...</p>;
    }

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

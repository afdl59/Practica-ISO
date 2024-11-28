import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Nuevo estado para autenticación
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica la sesión y obtiene el username
        fetch('/api/auth/check-session')
            .then((res) => {
                if (res.ok) {
                    setIsAuthenticated(true); // Usuario autenticado
                    return res.json();
                } else {
                    throw new Error('Usuario no autenticado');
                }
            })
            .then((data) => {
                const username = data.username;

                // Llama al endpoint de notificaciones
                return fetch(`/api/notificaciones/${username}`);
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Error obteniendo notificaciones');
                }
            })
            .then((notificaciones) => {
                setNotificaciones(notificaciones);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err.message === 'Usuario no autenticado') {
                    navigate('/login'); // Redirige al login
                } else {
                    console.error('Error cargando notificaciones:', err);
                    setNotificaciones([]); // Usuario autenticado pero sin notificaciones
                    setIsLoading(false);
                }
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

    if (isAuthenticated && notificaciones.length === 0) {
        return (
            <div className="notificaciones">
                <h2>Notificaciones</h2>
                <p>No tienes notificaciones en este momento.</p>
            </div>
        );
    }

    return (
        <div className="notificaciones">
            <h2>Notificaciones</h2>
            <ul>
                {notificaciones.map(({ _id, content, isRead }) => (
                    <li key={_id} style={{ opacity: isRead ? 0.5 : 1 }}>
                        {content}
                        {!isRead && (
                            <button onClick={() => marcarComoLeida(_id)}>
                                Marcar como leída
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notificaciones;

// src/components/PartidoDetalle.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DetallesPartido() {
  const { game_id } = useParams(); // Obtener el ID del partido desde la URL
  const [partido, setPartido] = useState(null);

  // Obtener los detalles del partido
  useEffect(() => {
    const fetchPartido = async () => {
      try {
        const response = await fetch(`/api/partido/${game_id}`);
        const data = await response.json();
        setPartido(data);
      } catch (error) {
        console.error('Error al obtener detalles del partido:', error);
      }
    };

    fetchPartido();
  }, [game_id]);

  if (!partido) {
    return <p>Cargando detalles del partido...</p>;
  }

  return (
    <div className="partido-detalle">
      <h1>{partido.home_club_name} vs {partido.away_club_name}</h1>
      <p>Marcador: {partido.home_club_goals} - {partido.away_club_goals}</p>
      <p>Fecha: {new Date(partido.date).toLocaleDateString()}</p>
      
      {/* Video de resumen de YouTube */}
      <div className="video-resumen">
        <iframe
          width="560"
          height="315"
          src={partido.url} // Asumiendo que 'url' contiene el enlace a YouTube
          title="Video resumen del partido"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default DetallesPartido;

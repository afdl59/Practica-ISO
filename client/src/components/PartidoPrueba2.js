// src/components/PartidoPrueba2.js
import React from 'react';
import espanaLogo from '../assets/espana_logo.png';  // Añade el logo de España
import holandaLogo from '../assets/holanda_logo.png';  // Añade el logo de Holanda

function PartidoPrueba2() {
  return (
    <div className="partido-detalle">
      <h1>Final Mundial 2010: España vs Holanda</h1>
      <div className="marcador">
        <img src={espanaLogo} alt="España" width="100" />
        <span>1 - 0</span>
        <img src={holandaLogo} alt="Holanda" width="100" />
      </div>
      <h2>Goles</h2>
      <ul>
        <li><strong>116'</strong> Andrés Iniesta (España)</li>
      </ul>
      <h2>Estadísticas</h2>
      <ul>
        <li>Posesión: España 57% - 43% Holanda</li>
        <li>Tiros a puerta: España 5 - 4 Holanda</li>
        <li>Corners: España 8 - 5 Holanda</li>
        <li>Fueras de juego: España 4 - 1 Holanda</li>
        <li>Tarjetas amarillas: España 5 - 9 Holanda</li>
        <li>Tarjetas rojas: 1 (Holanda, Heitinga)</li>
      </ul>
      <h2>Resumen en video</h2>
      <div className="video-resumen">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/WvWvQ7vVPHw"  // Video resumen de la final
          title="Resumen final Mundial 2010"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default PartidoPrueba2;

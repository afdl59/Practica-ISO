// src/components/PartidoPrueba1.js
import React from 'react';
import realMadridLogo from '../assets/real_madrid_logo.png';
import liverpoolLogo from '../assets/liverpool_logo.png';
import '../styles/PartidoPrueba.css';

function PartidoPrueba1() {
  return (
    <div className="partido-detalle">
      <h1>Final Champions League 2018: Real Madrid vs Liverpool</h1>
      <div className="marcador">
        <img src={realMadridLogo} alt="Real Madrid" width="100" />
        <span>3 - 1</span>
        <img src={liverpoolLogo} alt="Liverpool" width="100" />
      </div>
      <h2>Goles</h2>
      <ul>
        <li><strong>51'</strong> Karim Benzema (Real Madrid)</li>
        <li><strong>55'</strong> Sadio Mané (Liverpool)</li>
        <li><strong>64'</strong> Gareth Bale (Real Madrid)</li>
        <li><strong>83'</strong> Gareth Bale (Real Madrid)</li>
      </ul>
      <h2>Estadísticas</h2>
      <ul>
        <li>Posesión: Real Madrid 66% - 34% Liverpool</li>
        <li>Tiros a puerta: Real Madrid 8 - 3 Liverpool</li>
        <li>Corners: Real Madrid 5 - 4 Liverpool</li>
        <li>Fueras de juego: Real Madrid 2 - 1 Liverpool</li>
        <li>Tarjetas amarillas: Real Madrid 1 - 1 Liverpool</li>
        <li>Tarjetas rojas: Ninguna</li>
      </ul>
      <h2>Resumen en video</h2>
      <div className="video-resumen">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/2-qb3H-ZC1M"  // Video resumen de la final
          title="Resumen final Champions 2018"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default PartidoPrueba1;

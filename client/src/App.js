// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Minijuegos from './components/minijuegos/Minijuegos';
import Bingo from './components/minijuegos/Bingo'; 
import TiroLibre from './components/minijuegos/TiroLibre';
import Sidebar from './components/Sidebar';
import Partidos from './components/stats/Partidos';
import GuessThePlayer from './components/minijuegos/GuessThePlayer';
import PlayerSelector from './components/stats/PlayerSelector';
import Perfil from './components/user/Perfil';
import PartidoPrueba1 from './components/stats/PartidoPrueba1';
import PartidoPrueba2 from './components/stats/PartidoPrueba2';
import WordleDiario from './components/minijuegos/WordleDiario';
import Foro from './components/foro/Foro';
import PartidoDetalle from './components/stats/PartidoDetalle';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/minijuegos" element={<Minijuegos />} />
        <Route path="/perfil" element={<Perfil />} /> {/* Ruta para la página de perfil */}
        <Route path="/minijuegos/bingo" element={<Bingo />} /> {/* Ruta para Bingo */}
        <Route path="/minijuegos/tiro-libre" element={<TiroLibre />} /> {/* Ruta para Tiro Libre */}
        <Route path="/minijuegos/wordle-diario" element={<WordleDiario />} /> {/* Nueva ruta para Wordle Diario */}
        <Route path="/minijuegos/guess-the-player" element={<GuessThePlayer />} /> {/* Nueva ruta para Guess The Player */}
        <Route path="/player-selector" element={<PlayerSelector />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/partido-prueba1" element={<PartidoPrueba1 />} />
        <Route path="/partido-prueba2" element={<PartidoPrueba2 />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="/PartidoDetalle" element={<PartidoDetalle/>} />
      </Routes>
    </div>
  );
}

export default App;


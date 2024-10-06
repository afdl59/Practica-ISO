// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Minijuegos from './components/Minijuegos';
import Bingo from './components/Bingo'; 
import TiroLibre from './components/TiroLibre';
import Sidebar from './components/Sidebar';
import Partidos from './components/Partidos';
import GuessThePlayer from './components/GuessThePlayer';
import DetallesPartido from './components/PartidoDetalle';
import './styles/App.css';
import DetallesPartido from './components/DetallesPartido';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/minijuegos" element={<Minijuegos />} />
        <Route path="/minijuegos/bingo" element={<Bingo />} /> {/* Ruta para Bingo */}
        <Route path="/tiro-libre" element={<TiroLibre />} /> {/* Ruta para Tiro Libre */}
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/guess-the-player" element={<GuessThePlayer />} /> {/* Nueva ruta para Guess The Player */}
        <Route path="/partido/:partidoId" element={<DetallesPartido />} /> {/* Ruta para detalles del partido */}
      </Routes>
    </div>
  );
}

export default App;


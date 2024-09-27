// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar'; // Asegúrate de importar Sidebar
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar /> {/* Añadir Sidebar al layout de la App */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

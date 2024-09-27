// src/App.js
import React from 'react';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Home />
      <Sidebar />
    </div>
  );
}

export default App;



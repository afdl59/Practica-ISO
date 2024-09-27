// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const sections = [
    { title: 'Notificaciones Personalizadas', imgSrc: '/src/assets/logo.jpeg' },
    { title: 'Estadísticas', imgSrc: '/src/assets/logo.jpeg' },
    { title: 'Foro', imgSrc: '/src/assets/logo.jpeg' },
    { title: 'Minijuegos', imgSrc: '/src/assets/logo.jpeg' },
  ];

  return (
    <div className="sidebar">
      {sections.map((section, index) => (
        <div key={index} className="sidebar-section">
          <img src={section.imgSrc} alt={section.title} className="sidebar-icon" />
          <p className="sidebar-title">{section.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

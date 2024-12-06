import React, { useState } from 'react';
import '../../styles/user/Perfil.css';

function Perfil() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    alert(`Iniciaste sesión como ${email}`);
  };

  return (
    <div className="perfil-container">
      {/* Texto de inicio de sesión */}
      <p className="social-text">Inicia sesión con tu cuenta social</p>

      {/* Botón de Google */}
      <div className="social-login">
        <button className="google-btn">Continuar con Google</button>
      </div>

      {/* Formulario de inicio de sesión */}
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin}>
          INICIAR SESIÓN
        </button>
      </form>
    </div>
  );
}

export default Perfil;

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
    <div className="main-container">
      {/* Anuncio izquierdo */}
      <div className="sidebar">
        <p>Espacio para anuncio</p>
      </div>

      {/* Contenedor del formulario */}
      <div className="perfil-container">
        <p className="social-text">Inicia sesión con tu cuenta social</p>

        <div className="social-login">
          <button className="google-btn">Continuar con Google</button>
        </div>

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

      {/* Anuncio derecho */}
      <div className="sidebar">
        <p>Espacio para anuncio</p>
      </div>
    </div>
  );
}

export default Perfil;

import React from 'react';
import { Routes, Route } from 'react-router-dom';

//Componentes principales
import Sidebar from './components/Sidebar';
import Home from './components/Home';

//User
import Login from './components/user/Login';
import Register from './components/user/Register';
import Perfil from './components/user/Perfil';
import AnadirEquipoFavorito from './components/user/AnadirEquipoFavorito';
import AnadirCompeticionFavorita from './components/user/AnadirCompeticionFavorita';

//Foro
import Foro from './components/foro/Foro';

// Minijuegos
import Minijuegos from './components/minijuegos/Minijuegos';
import Bingo from './components/minijuegos/Bingo';
import TiroLibre from './components/minijuegos/TiroLibre';
import WordleDiario from './components/minijuegos/WordleDiario';
import GuessThePlayer from './components/minijuegos/GuessThePlayer';

// Estadísticas y Partidos
import Partidos from './components/stats/Partidos';
import PlayerSelector from './components/stats/PlayerSelector';
import PartidoDetalle from './components/stats/PartidoDetalle';
import PartidosDirecto from './components/stats/PartidosDirecto';
import PartidoPrueba1 from './components/stats/PartidoPrueba1';
import PartidoPrueba2 from './components/stats/PartidoPrueba2';
import ProximosPartidos from './components/stats/ProximosPartidos';
import ProximoPartidoDetalle from './components/stats/ProximoPartidoDetalle';
import Predicciones from './components/stats/Predicciones';

//Notificaciones
import Notificaciones from './components/notificaciones/Notificaciones';

//Terminos y Condiciones
import Terms from './components/Terms';
import Privacy from './components/Privacy';

//CSS
import './styles/App.css';
import { UserProvider } from './context/UserContext';
import { LeaderboardProvider } from './context/LeaderboardContext';

function App() {
  return (
    <UserProvider>
      <LeaderboardProvider>
        <div className="app-container">
          {/* Sidebar */}
          <Sidebar />

          {/* Barra animada */}
          <div className="animated-bar">
            <span className="animated-bar-text">
              ¡Bienvenido a Futbol360! Consulta estadísticas, participa en predicciones, juega minijuegos y más.
            </span>
          </div>

          {/* Rutas principales */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/foro" element={<Foro />} />
            <Route path="/notificaciones" element={<Notificaciones />} />

            {/* Rutas de Perfil */}
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/anadir-equipo-favorito" element={<AnadirEquipoFavorito />} />
            <Route path="/perfil/anadir-competicion-favorita" element={<AnadirCompeticionFavorita />} />

            {/* Rutas de Minijuegos */}
            <Route path="/minijuegos" element={<Minijuegos />} />
            <Route path="/minijuegos/bingo" element={<Bingo />} />
            <Route path="/minijuegos/tiro-libre" element={<TiroLibre />} />
            <Route path="/minijuegos/wordle-diario" element={<WordleDiario />} />
            <Route path="/minijuegos/guess-the-player" element={<GuessThePlayer />} />

            {/* Rutas de Estadísticas y Partidos */}
            <Route path="/partidos" element={<Partidos />} />
            <Route path="/player-selector" element={<PlayerSelector />} />
            <Route path="/partido/:idPartido" element={<PartidoDetalle />} />
            <Route path="/partidos-directo" element={<PartidosDirecto />} />
            <Route path="/proximos-partidos" element={<ProximosPartidos />} />
            <Route path="/proximos-partidos/:idPartido" element={<ProximoPartidoDetalle />} />
            <Route path="/predicciones" element={<Predicciones />} />
            <Route path="/partido-prueba1" element={<PartidoPrueba1 />} />
            <Route path="/partido-prueba2" element={<PartidoPrueba2 />} />

            {/* Rutas de Términos y Condiciones */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>
      </LeaderboardProvider>
    </UserProvider>
  );
}

export default App;

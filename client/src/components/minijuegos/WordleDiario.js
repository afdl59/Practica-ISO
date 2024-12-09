import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/WordleDiario.css';
import { useLeaderboard } from '../../context/LeaderboardContext';

const jugadores = [
  'Pele', 'Maradona', 'Zidane', 'Ronaldo', 'Ronaldinho', 'Messi', 'Cristiano Ronaldo', 'Johan Cruyff', 
  'Franz Beckenbauer', 'Alfredo Di Stefano', 'Ferenc Puskas', 'Garrincha', 'Michel Platini', 'Marco van Basten', 
  'Eusebio', 'Gerd Muller', 'Ronaldo', 'Eusebio', 'Ronaldinho', 'Zico', 'George Best', 
  'Lothar Matthaus', 'Bobby Charlton', 'Romario', 'Xavi Hernandez', 'Andres Iniesta', 'Thierry Henry', 
  'Dennis Bergkamp', 'Rivaldo', 'Kaka', 'Luis Suarez', 'Hristo Stoichkov', 'Ruud Gullit', 'Eric Cantona', 
  'David Beckham', 'Didier Drogba', 'Samuel Eto\'o', 'Ryan Giggs', 'Wayne Rooney', 'Ronald Koeman', 
  'Frank Rijkaard', 'Fabio Cannavaro', 'Francesco Totti', 'Andrea Pirlo', 'Clarence Seedorf', 'Sergio Ramos', 
  'Iker Casillas', 'Oliver Kahn', 'Gianluigi Buffon', 'Peter Schmeichel', 'Patrick Vieira', 'Roy Keane', 
  'Pavel Nedved', 'George Weah', 'Jay-Jay Okocha', 'Zlatan Ibrahimovic', 'Raul Gonzalez', 'Fernando Torres', 
  'Luis Figo', 'Roberto Carlos', 'Cafu', 'Dino Zoff', 'Gaetano Scirea', 'Alan Shearer', 'Jurgen Klinsmann', 
  'Gheorghe Hagi', 'Carlos Valderrama', 'Ivan Zamorano', 'Enzo Francescoli', 'Hugo Sanchez', 'Javier Zanetti', 
  'Diego Forlan', 'Antonio Conte', 'Robert Lewandowski', 'Manuel Neuer', 'Philipp Lahm', 'Miroslav Klose', 
  'Thomas Muller', 'Kevin De Bruyne', 'Eden Hazard', 'Pierre-Emerick Aubameyang', 'Alexis Sanchez', 'Arturo Vidal', 
  'Sadio Mane', 'Mohamed Salah', 'Luka Modric', 'Toni Kroos', 'Sergio Busquets', 'Gerard Pique', 'Kylian Mbappe', 
  'Neymar', 'Antoine Griezmann', 'Paul Pogba', 'Edinson Cavani', 'Diego Godin', 'Marcelo Vieira', 'Dani Alves', 
  'Giorgio Chiellini', 'Leonardo Bonucci', 'Harry Kane', 'Heung-min Son', 'Karim Benzema', 'Vinicius Junior', 
  'Erling Haaland', 'Jadon Sancho', 'Virgil van Dijk', 'Frenkie de Jong', 'Memphis Depay', 'David Silva', 
  'Jan Oblak', 'Thibaut Courtois', 'Riyad Mahrez', 'Joao Felix', 'Bruno Fernandes', 'James Rodriguez', 
  'Radamel Falcao', 'Juan Roman Riquelme', 'Carlos Tevez', 'Sergio Aguero', 'Javier Mascherano', 'Robinho', 
  'Clarence Seedorf', 'Gennaro Gattuso', 'Luis Enrique', 'Fernando Redondo', 'Pep Guardiola', 'Michael Laudrup', 
  'Brian Laudrup', 'Andriy Shevchenko', 'Henrik Larsson', 'Ruud van Nistelrooy', 'Michael Ballack', 'David Villa', 
  'David Trezeguet', 'Patrick Kluivert', 'Marc Overmars', 'Laurent Blanc', 'Rui Costa', 'Davor Suker', 'Rafael Marquez', 
  'Hernan Crespo', 'Gabriel Batistuta', 'Christian Vieri', '', 'Juan Mata', 'Jean-Pierre Papin', 
  'Claude Makelele', 'Roberto Ayala', 'Franco Baresi', 'Ricardo Kaka', 'Pippo Inzaghi', 'Ivan Rakitic', 
  'Mateo Kovacic', 'Romelu Lukaku', 'Gonzalo Higuain', 'Angel Di Maria', 'Xabi Alonso', 'Cesc Fabregas', 
  'Santi Cazorla', 'Mario Kempes', 'Mario Gotze', 'Mesut Ozil', 'Andre Schurrle', 'Paul Scholes', 'Gary Neville', 
  'Rio Ferdinand', 'Nemanja Vidic', 'John Terry', 'Frank Lampard', 'Steven Gerrard', 'Yaya Toure', 'Nwankwo Kanu', 
  'Obafemi Martins', 'Victor Valdes', 'Carles Puyol', 'Deco', 'Roberto Rivelino', 'Junior', 'Tostao', 'Clodoaldo', 
  'Jose Luis Chilavert', 'Oscar Ruggeri', 'Alvaro Arbeloa', 'Marchisio', 'Michael Essien', 'Kurzawa', 
  'Alexandre Pato', 'Adriano', 'Eder Militao', 'Roberto Firmino', 'Lucas Moura', 'Ederson Moraes', 'Alisson Becker', 
  'Rafinha', 'Maxwell', 'Thiago Silva', 'Marquinhos', 'Paulo Dybala', 'Javier Pastore', 'Daniele De Rossi', 
  'Joao Moutinho', 'Pepe', 'Ricardo Carvalho', 'Deco', 'Cristian Chivu', 'Edin Dzeko', 'Miralem Pjanic', 
  'Jerome Boateng', 'Joshua Kimmich', 'Kingsley Coman', 'Serge Gnabry', 'Leroy Sane', 'Kai Havertz', 'Timo Werner', 
  'Sergio Reguilon', 'Mikel Oyarzabal', 'Aymeric Laporte', 'Rodri', 'Ferran Torres', 'Adama Traore', 'Gerard Moreno', 
  'Ruben Dias', 'Joao Cancelo', 'Renato Sanches', 'Nani', 'Pepe Reina', 'Raul Albiol', 'Dani Parejo', 'Iago Aspas', 
  'Kepa Arrizabalaga', 'Alvaro Morata', 'Paco Alcacer', 'Marc-Andre ter Stegen', 'David Alaba', 'Marcelo Brozovic', 
  'Josip Ilicic', 'Duvan Zapata', 'Alejandro Gomez', 'Leonardo Spinazzola', 'Federico Chiesa', 'Ciro Immobile', 
  'Federico Bernardeschi', 'Lorenzo Insigne', 'Nicolo Barella', 'Alessandro Florenzi', 'Gigi Donnarumma', 
  'Mateo Musacchio', 'Lucas Biglia', 'Mauro Icardi', 'Joaquin Correa', 'Gio Lo Celso', 'Leandro Paredes', 
  'Lucas Ocampos', 'Ever Banega', 'Jesus Navas', 'Stefan de Vrij', 'Isco Alarcon', 'Jan Vertonghen', 
  'Toby Alderweireld', 'Christian Eriksen', 'Ivan Perisic', 'Achraf Hakimi', 'Hakim Ziyech', 'Nicolas Pepe', 
  'Thomas Partey', 'Alex Iwobi', 'Wilfried Zaha', 'Sokratis Papastathopoulos', 'Bernd Leno', 'Gabriel Magalhaes', 
  'Bukayo Saka', 'Emile Smith Rowe', 'Phil Foden', 'Ruben Neves', 'Diogo Jota', 'Adrian Mutu', 'Ciprian Tatarusanu', 
  'Stefan Radu', 'Borja Baston', 'Dimitri Payet', 'Florian Thauvin', 'Anthony Martial', 'Riyad Mahrez', 
  'Achraf Hakimi', 'Nordin Amrabat', 'Sofiane Feghouli', 'Kevin Gameiro', 'Youssef En-Nesyri', 'Karim El Ahmadi', 
  'Mohamed Elneny', 'Amr Zaki', 'David Silva', 'Essam El-Hadary', 'Alireza Jahanbakhsh', 'Sardar Azmoun', 
  'Mehdi Taremi', 'Shinji Kagawa', 'Van Persie', 'Hidetoshi Nakata', 'Park Ji-sung', 'Marcos Reus', 
  'Son Heung-min', 'Lee Kang-in', 'Tim Cahill', 'Mark Viduka', 'Harry Kewell', 'Christian Pulisic', 
  'Landon Donovan', 'Clint Dempsey', 'Brian McBride', 'Brad Friedel', 'Kasey Keller', 'Michael Bradley', 
  'Weston McKennie', 'Tyler Adams', 'Giovanni Reyna', 'Alphonso Davies', 'Jonathan David', 'Diego Lainez', 
  'Hirving Lozano', 'Raul Jimenez', 'Guillermo Ochoa', 'Tamudo', 'Javier Hernandez', 'Bebe', 
  'Rafa Marquez', 'Wesley Sneijder'
];

// Componente principal
function WordleDiario() {
  const { leaderboards, updateLeaderboard } = useLeaderboard();
  const leaderboard = leaderboards['wordle'] || [];

  const [jugadorDelDia, setJugadorDelDia] = useState('');
  const [inputUsuario, setInputUsuario] = useState('');
  const [intentos, setIntentos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState('');

  const maxIntentos = 6;

  useEffect(() => {
    const diaDelAno = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setJugadorDelDia(jugadores[diaDelAno % jugadores.length]);
    const fetchUsername = async () => {
      const sessionResponse = await fetch('/api/auth/check-session');
      const sessionData = await sessionResponse.json();
      setUsername(sessionData.username);
    };
    fetchUsername();
  }, []);

  const handleInputChange = (e) => {
    setInputUsuario(e.target.value.toUpperCase());
  };

  const handleSubmit = () => {
    if (!jugadorDelDia) return;

    const inputSinEspacios = inputUsuario.trim().replace(/\s+/g, '').toUpperCase();
    const jugadorSinEspacios = jugadorDelDia.replace(/\s+/g, '').toUpperCase();

    if (inputSinEspacios.length !== jugadorSinEspacios.length) {
      setMensaje('¡Asegúrate de que la longitud coincida!');
      return;
    }

    const nuevoIntento = validarIntento(inputSinEspacios, jugadorSinEspacios);
    setIntentos((prev) => [...prev, nuevoIntento]);
    setInputUsuario('');

    if (inputSinEspacios === jugadorSinEspacios) {
      const calculatedScore = (maxIntentos - intentos.length) * 10; // Puntos según intentos restantes
      setScore(calculatedScore);
      setMensaje('¡Felicidades! Has adivinado el jugador.');
      const updateScore = async (username, category, newScore) => {
        try {
            const response = await fetch(`/api/users/${username}/score`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category, newScore }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                console.error('Error al actualizar puntuación:', error);
                return;
            }
    
            const data = await response.json();
            console.log('Puntuación actualizada:', data);
        } catch (error) {
            console.error('Error de red al actualizar la puntuación:', error);
        }
    };

    updateScore(username, 'wordle', calculatedScore);

      // Actualizar Leaderboard
      updateLeaderboard('wordle', 'Jugador', calculatedScore);
    } else if (intentos.length + 1 >= maxIntentos) {
      setMensaje(`¡Fin del juego! El jugador era: ${jugadorDelDia}`);
    } else {
      setMensaje('¡Sigue intentando!');
    }
  };

  const validarIntento = (input, jugador) => {
    const resultado = [];
    const jugadorArray = jugador.split('');
    const inputArray = input.split('');

    // Validación de letras en la posición correcta
    jugadorArray.forEach((letra, index) => {
      if (inputArray[index] === letra) {
        resultado.push({ letra: inputArray[index], estado: 'verde' });
        jugadorArray[index] = null; // Marcar como usada
      } else {
        resultado.push({ letra: inputArray[index], estado: 'gris' });
      }
    });

    // Validación de letras en posiciones incorrectas
    resultado.forEach((item, index) => {
      if (item.estado === 'gris' && jugadorArray.includes(inputArray[index])) {
        item.estado = 'amarillo';
        jugadorArray[jugadorArray.indexOf(inputArray[index])] = null; // Marcar como usada
      }
    });

    return resultado;
  };

  const mostrarCasillasIniciales = () => {
    if (!jugadorDelDia) return null;

    return jugadorDelDia.split('').map((char, index) => (
      <div key={index} className={char === ' ' ? 'casilla espacio' : 'casilla vacia'}>
        {char === ' ' ? '\u00A0' : ''}
      </div>
    ));
  };

  return (
    <div className="wordle-container">
      <h1>Wordle Diario - Adivina el Jugador</h1>
      <div className="game-section">
        <div className="game-content">
          <p>{mensaje}</p>

          <div className="intentos">
            {intentos.length === 0 && (
              <div className="fila-intento">{mostrarCasillasIniciales()}</div>
            )}
            {intentos.map((intento, index) => (
              <div key={index} className="fila-intento">
                {intento.map((letra, idx) => (
                  <div key={idx} className={`casilla ${letra.estado}`}>
                    {letra.letra}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {intentos.length < maxIntentos && mensaje !== `¡Fin del juego! El jugador era: ${jugadorDelDia}` && (
            <div className="input-container">
              <input
                type="text"
                value={inputUsuario}
                onChange={handleInputChange}
                maxLength={jugadorDelDia.replace(/\s+/g, '').length}
              />
              <button onClick={handleSubmit}>Enviar</button>
            </div>
          )}

          {intentos.length >= maxIntentos && (
            <div className="resultado">
              <p>¡Se acabaron los intentos! El jugador era: <strong>{jugadorDelDia}</strong></p>
            </div>
          )}

          <h2>Puntuación: {score}</h2>
        </div>

        <div className="leaderboard-section">
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Jugador</th>
                <th>Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.playerName}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WordleDiario;
import React, { useState, useEffect } from 'react';
import '../../styles/WordleDiario.css';  // Importa la hoja de estilos

const jugadores = [
  'Pele', 'Maradona', 'Zidane', 'Ronaldo', 'Ronaldinho', 'Messi', 'Cristiano Ronaldo', 'Johan Cruyff', 
  'Franz Beckenbauer', 'Alfredo Di Stefano', 'Ferenc Puskas', 'Garrincha', 'Michel Platini', 'Marco van Basten', 
  'Eusebio', 'Gerd Muller', 'Lev Yashin', 'Roberto Baggio', 'Paolo Maldini', 'Zico', 'George Best', 
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
  'Hernan Crespo', 'Gabriel Batistuta', 'Christian Vieri', 'Lilian Thuram', 'Fabien Barthez', 'Jean-Pierre Papin', 
  'Claude Makelele', 'Roberto Ayala', 'Franco Baresi', 'Ricardo Kaka', 'Pippo Inzaghi', 'Ivan Rakitic', 
  'Mateo Kovacic', 'Romelu Lukaku', 'Gonzalo Higuain', 'Angel Di Maria', 'Xabi Alonso', 'Cesc Fabregas', 
  'Santi Cazorla', 'Mario Kempes', 'Mario Gotze', 'Mesut Ozil', 'Andre Schurrle', 'Paul Scholes', 'Gary Neville', 
  'Rio Ferdinand', 'Nemanja Vidic', 'John Terry', 'Frank Lampard', 'Steven Gerrard', 'Yaya Toure', 'Nwankwo Kanu', 
  'Obafemi Martins', 'Victor Valdes', 'Carles Puyol', 'Deco', 'Roberto Rivelino', 'Junior', 'Tostao', 'Clodoaldo', 
  'Jose Luis Chilavert', 'Oscar Ruggeri', 'Jorge Burruchaga', 'Claudio Caniggia', 'Michael Essien', 'Sulley Muntari', 
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
  'Lucas Ocampos', 'Ever Banega', 'Jesus Navas', 'Stefan de Vrij', 'Milan Skriniar', 'Jan Vertonghen', 
  'Toby Alderweireld', 'Christian Eriksen', 'Ivan Perisic', 'Achraf Hakimi', 'Hakim Ziyech', 'Nicolas Pepe', 
  'Thomas Partey', 'Alex Iwobi', 'Wilfried Zaha', 'Sokratis Papastathopoulos', 'Bernd Leno', 'Gabriel Magalhaes', 
  'Bukayo Saka', 'Emile Smith Rowe', 'Phil Foden', 'Ruben Neves', 'Diogo Jota', 'Adrian Mutu', 'Ciprian Tatarusanu', 
  'Stefan Radu', 'Dan Petrescu', 'Dimitri Payet', 'Florian Thauvin', 'Anthony Martial', 'Riyad Mahrez', 
  'Achraf Hakimi', 'Nordin Amrabat', 'Sofiane Feghouli', 'Islam Slimani', 'Youssef En-Nesyri', 'Karim El Ahmadi', 
  'Mohamed Elneny', 'Amr Zaki', 'Hossam Hassan', 'Essam El-Hadary', 'Alireza Jahanbakhsh', 'Sardar Azmoun', 
  'Mehdi Taremi', 'Shinji Kagawa', 'Keisuke Honda', 'Hidetoshi Nakata', 'Park Ji-sung', 'Cha Bum-kun', 
  'Son Heung-min', 'Lee Kang-in', 'Tim Cahill', 'Mark Viduka', 'Harry Kewell', 'Christian Pulisic', 
  'Landon Donovan', 'Clint Dempsey', 'Brian McBride', 'Brad Friedel', 'Kasey Keller', 'Michael Bradley', 
  'Weston McKennie', 'Tyler Adams', 'Giovanni Reyna', 'Alphonso Davies', 'Jonathan David', 'Diego Lainez', 
  'Hirving Lozano', 'Raul Jimenez', 'Guillermo Ochoa', 'Oribe Peralta', 'Javier Hernandez', 'Carlos Salcido', 
  'Rafa Marquez', 'Cuauhtemoc Blanco'
];

// Función para obtener el jugador del día
const obtenerJugadorDelDia = () => {
  const fechaActual = new Date();
  const diaDelAño = Math.floor((fechaActual - new Date(fechaActual.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return jugadores[diaDelAño % jugadores.length];
};

function WordleDiario() {
  const [jugadorDelDia, setJugadorDelDia] = useState('');
  const [intento, setIntento] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(6); // Como en el Wordle original
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const jugador = obtenerJugadorDelDia();
    setJugadorDelDia(jugador);
  }, []);

  const manejarIntento = () => {
    if (intento.toLowerCase() === jugadorDelDia.toLowerCase()) {
      setMensaje('¡Correcto! Has adivinado el jugador.');
      setHistorial([...historial, intento]);
    } else {
      const intentosRestantesActualizados = intentosRestantes - 1;
      setIntentosRestantes(intentosRestantesActualizados);
      setHistorial([...historial, intento]);

      if (intentosRestantesActualizados <= 0) {
        setMensaje(`Te has quedado sin intentos. El jugador era ${jugadorDelDia}.`);
      } else {
        setMensaje('Incorrecto. Intenta de nuevo.');
      }
    }
    setIntento('');  // Limpiar el campo de entrada
  };

  return (
    <div className="wordle-container">
      <h1>Wordle Diario</h1>
      <p>Adivina el jugador histórico del día</p>

      <div className="intentos-restantes">
        Intentos restantes: {intentosRestantes}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={intento}
          onChange={(e) => setIntento(e.target.value)}
          placeholder="Introduce el nombre del jugador"
          disabled={intentosRestantes === 0 || mensaje.includes('Correcto')}
        />
        <button onClick={manejarIntento} disabled={intentosRestantes === 0 || mensaje.includes('Correcto')}>
          Probar
        </button>
      </div>

      <div className="historial">
        {historial.map((intento, index) => (
          <p key={index}>{intento}</p>
        ))}
      </div>

      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
}

export default WordleDiario;

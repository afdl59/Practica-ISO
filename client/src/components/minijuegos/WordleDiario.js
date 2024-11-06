import React, { useState, useEffect } from 'react';
import '../../styles/minijuegos/WordleDiario.css';  // Importa la hoja de estilos

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

// Función para obtener el jugador del día
function WordleDiario() {
  const [jugadorDelDia, setJugadorDelDia] = useState('');
  const [inputUsuario, setInputUsuario] = useState('');
  const [intentos, setIntentos] = useState([]);

  useEffect(() => {
    // Calcular el día del año para seleccionar un jugador basado en la fecha actual
    const diaDelAno = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setJugadorDelDia(jugadores[diaDelAno % jugadores.length]); // Rotar entre los jugadores disponibles
  }, []);

  const handleInputChange = (e) => {
    setInputUsuario(e.target.value.toUpperCase()); // Asegurarse de que todo sea mayúscula
  };

  const handleSubmit = () => {
    if (!jugadorDelDia) {
      alert('El jugador del día aún no está disponible. Por favor, espera un momento.');
      return;
    }

    // Limpiar espacios en blanco del input del usuario y del jugador del día
    const inputUsuarioConMayusculas = inputUsuario.replace(/\s+/g, '').toUpperCase();
    const jugadorDelDiaSinEspacios = jugadorDelDia.replace(/\s+/g, '').toUpperCase();

    // Comprobar si la longitud del input del usuario coincide con la del jugador del día sin contar espacios
    if (inputUsuarioConMayusculas.length !== jugadorDelDiaSinEspacios.length) {
      alert('La longitud del nombre debe coincidir con la del jugador (sin contar espacios).');
      return;
    }

    const nuevoIntento = validarIntento(inputUsuarioConMayusculas, jugadorDelDiaSinEspacios);
    setIntentos([...intentos, nuevoIntento]);
    setInputUsuario('');
  };

  const validarIntento = (input, nombreJugador) => {
    const resultado = [];
    const nombreJugadorArray = nombreJugador.split('');
    const inputArray = input.split('');

    // Paso 1: Marcar las letras que están en la posición correcta (verde)
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i] === nombreJugadorArray[i]) {
        resultado.push({ letra: inputArray[i], estado: 'verde' });
      } else {
        resultado.push({ letra: inputArray[i], estado: 'gris' });
      }
    }

    // Paso 2: Marcar las letras que están en el nombre pero en una posición incorrecta (amarillo)
    for (let i = 0; i < inputArray.length; i++) {
      if (resultado[i].estado === 'gris' && inputArray[i] !== ' ') {
        for (let j = 0; j < nombreJugadorArray.length; j++) {
          if (
            inputArray[i] === nombreJugadorArray[j] &&
            resultado[j]?.estado !== 'verde' &&
            !resultado.some((r, index) => r.letra === nombreJugadorArray[j] && r.estado === 'amarillo' && index !== i)
          ) {
            resultado[i].estado = 'amarillo';
            break;
          }
        }
      }
    }

    return resultado;
  };

  // Mostrar casillas vacías para el nombre del jugador antes de adivinar
  const mostrarCasillasIniciales = () => {
    if (!jugadorDelDia) return null; // Si jugadorDelDia aún no está listo, no renderizamos casillas
    console.log(jugadorDelDia);

    const casillas = [];
    for (let i = 0; i < jugadorDelDia.length; i++) {
      if (jugadorDelDia[i] === ' ') {
        casillas.push(<div key={i} className="casilla espacio">{'\u00A0'}</div>); // Mostrar espacio
      } else {
        casillas.push(<div key={i} className="casilla vacia">{'\u00A0'}</div>); // Mostrar casilla vacía
      }
    }
    return casillas;
  };

  return (
    <div className="wordle-container">
      <h1>Wordle Diario - Adivina el Jugador</h1>

      <div className="intentos">
        {intentos.length === 0 && (
          <div className="fila-intento">
            {mostrarCasillasIniciales()}
          </div>
        )}

        {intentos.map((intento, index) => (
          <div key={index} className="fila-intento">
            {intento.map((letra, idx) => (
              <div key={idx} className={`casilla ${letra.estado}`}>
                {letra.letra === ' ' ? '\u00A0' : letra.letra}
              </div>
            ))}
          </div>
        ))}
      </div>

      {jugadorDelDia && intentos.length < 6 && (
        <div className="input-container">
          <input
            type="text"
            value={inputUsuario}
            onChange={handleInputChange}
            maxLength={jugadorDelDia.length}
          />
          <button onClick={handleSubmit}>Enviar</button>
        </div>
      )}

      {intentos.length >= 6 && (
        <div className="resultado">
          <p>¡Se acabaron los intentos! El jugador era: {jugadorDelDia}</p>
        </div>
      )}
    </div>
  );
}

export default WordleDiario;

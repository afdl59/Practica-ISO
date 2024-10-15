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
const WordleDiario = () => {
  const [nombreJugador, setNombreJugador] = useState("");
  const [letrasAdivinadas, setLetrasAdivinadas] = useState(["\u00A0", "\u00A0", "\u00A0", "\u00A0", "\u00A0"]);
  const [intentos, setIntentos] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(5);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Seleccionar un jugador aleatorio solo una vez
    const jugadorAleatorio = jugadores[Math.floor(Math.random() * jugadores.length)];
    setNombreJugador(jugadorAleatorio);
  }, []);

  const mostrarCasillasIniciales = () => {
    return letrasAdivinadas.map((letra, index) => (
      <input 
        key={index}
        type="text"
        maxLength="1"
        value={letra}
        readOnly
        className="input-casilla"
      />
    ));
  };

  const validarIntento = (intento) => {
    const letrasCorrectas = nombreJugador.split('');
    let resultado = [];
    
    for (let i = 0; i < intento.length; i++) {
      if (intento[i] === letrasCorrectas[i]) {
        resultado.push("verde");
      } else if (letrasCorrectas.includes(intento[i])) {
        resultado.push("amarillo");
      } else {
        resultado.push("gris");
      }
    }
    return resultado;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (intentosRestantes === 0) {
      return;
    }
    
    const intentoActual = e.target.intento.value.trim().toLowerCase();
    if (intentoActual.length !== nombreJugador.length) {
      setMensaje("Introduce un nombre válido");
      return;
    }

    const resultado = validarIntento(intentoActual);
    const nuevoIntento = {
      intento: intentoActual,
      resultado: resultado
    };

    setIntentos([...intentos, nuevoIntento]);
    setIntentosRestantes(intentosRestantes - 1);

    if (intentoActual === nombreJugador) {
      setMensaje("¡Has acertado!");
    } else if (intentosRestantes - 1 === 0) {
      setMensaje(`Se te acabaron los intentos. El jugador era: ${nombreJugador}`);
    }
    
    // Resetear la casilla de intento
    e.target.intento.value = '';
  };

  return (
    <div className="container">
      <h1>Wordle: Adivina el Jugador</h1>
      <div className="casillas">
        {mostrarCasillasIniciales()}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="intento"
          maxLength="5"
          placeholder="Introduce el nombre del jugador"
          className="input-intento"
        />
        <button type="submit">Adivinar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <div className="resultados">
        {intentos.map((intento, index) => (
          <div key={index}>
            <span>{intento.intento}</span>
            <span>{intento.resultado.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordleDiario;

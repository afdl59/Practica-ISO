module.exports = {
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'], // Carga las variables de entorno
    testTimeout: 30000, // Incrementa el tiempo de espera si pruebas MongoDB
  };
  
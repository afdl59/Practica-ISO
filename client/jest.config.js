module.exports = {
    testEnvironment: 'jsdom', // Configura Jest para un entorno DOM simulado
    transformIgnorePatterns: [
        '/node_modules/(?!@bundled-es-modules)' // Transforma módulos ESM específicos
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock de estilos CSS
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js' // Mock de archivos multimedia
    }
};

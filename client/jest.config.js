module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' // Transforma archivos JS/TS usando Babel
    },
    transformIgnorePatterns: [
        '/node_modules/(?!msw)' // Transforma específicamente el módulo `msw`
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock para estilos
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js' // Mock para archivos multimedia
    }
};


module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest' // Transforma archivos JS/TS utilizando Babel
    },
    transformIgnorePatterns: [
        '/node_modules/(?!msw)' // Asegura que Jest transforme el módulo `msw`
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Configuración adicional después del entorno
};



module.exports = {
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!@bundled-es-modules|msw)' // Transforma módulos ESM específicos
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
    }
};

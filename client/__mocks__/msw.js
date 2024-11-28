module.exports = {
    rest: {},
    setupServer: () => ({
        listen: jest.fn(),
        close: jest.fn(),
        resetHandlers: jest.fn()
    })
};

module.exports = {
    rest: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn()
    },
    setupServer: () => ({
        listen: jest.fn(),
        close: jest.fn(),
        resetHandlers: jest.fn()
    })
};

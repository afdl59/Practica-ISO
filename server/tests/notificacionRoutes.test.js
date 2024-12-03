const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Asegúrate de que exportas tu app desde server.js
const Notification = require('../models/Notification');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Notificaciones API', () => {
    let testUser;

    beforeEach(async () => {
        // Crear un usuario de prueba
        testUser = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123', // En producción, debe estar hasheado
        });

        // Crear notificaciones para el usuario
        await Notification.create([
            {
                userId: testUser._id,
                type: 'foro',
                content: 'Tienes una nueva mención en el foro.',
            },
            {
                userId: testUser._id,
                type: 'estadisticas',
                content: 'Nuevas estadísticas disponibles.',
            },
        ]);
    });

    afterEach(async () => {
        await User.deleteMany();
        await Notification.deleteMany();
    });

    it('Debe retornar las notificaciones de un usuario', async () => {
        const res = await request(app).get(`/api/notificaciones/${testUser.username}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('content');
        expect(res.body[0]).toHaveProperty('type');
    });

    it('Debe marcar una notificación como leída', async () => {
        const notification = await Notification.findOne({ userId: testUser._id });

        const res = await request(app).patch(`/api/notificaciones/marcar-leida/${notification._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.isRead).toBe(true);
    });

    it('Debe retornar 404 si el usuario no existe', async () => {
        const res = await request(app).get('/api/notificaciones/nonexistentuser');

        expect(res.statusCode).toBe(404);
    });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Notificaciones from './Notificaciones';

const server = setupServer(
    rest.get('/api/auth/check-session', (req, res, ctx) => {
        return res(ctx.json({ username: 'testuser' }));
    }),
    rest.get('/api/notificaciones/testuser', (req, res, ctx) => {
        return res(ctx.json([
            { _id: '1', content: 'Tienes una nueva mención en el foro.', isRead: false },
            { _id: '2', content: 'Nuevas estadísticas disponibles.', isRead: false },
        ]));
    }),
    rest.patch('/api/notificaciones/marcar-leida/:id', (req, res, ctx) => {
        return res(ctx.json({ _id: req.params.id, isRead: true }));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Notificaciones Component', () => {
    it('Debe renderizar notificaciones correctamente', async () => {
        render(<Notificaciones />);

        await waitFor(() => {
            expect(screen.getByText('Tienes una nueva mención en el foro.')).toBeInTheDocument();
            expect(screen.getByText('Nuevas estadísticas disponibles.')).toBeInTheDocument();
        });
    });

    it('Debe marcar una notificación como leída', async () => {
        render(<Notificaciones />);

        const button = await screen.findByText('Marcar como leída', { selector: 'button' });
        button.click();

        await waitFor(() => {
            const updatedNotification = screen.getByText('Tienes una nueva mención en el foro.');
            expect(updatedNotification).toHaveStyle('opacity: 0.5');
        });
    });

    it('Debe redirigir al login si el usuario no está autenticado', async () => {
        server.use(
            rest.get('/api/auth/check-session', (req, res, ctx) => {
                return res(ctx.status(401));
            })
        );

        render(<Notificaciones />);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/login');
        });
    });
});

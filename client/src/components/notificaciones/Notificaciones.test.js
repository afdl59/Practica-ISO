import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Notificaciones from './Notificaciones';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(() => jest.fn()) // Mockea useNavigate
}));

const navigate = jest.fn();
global.fetch = jest.fn();

describe('Notificaciones Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia mocks antes de cada prueba
    });

    it('Renderiza notificaciones correctamente', async () => {
        // Mock para la autenticación
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );

        // Mock para las notificaciones
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { _id: '1', content: 'Tienes una nueva mención en el foro.', isRead: false },
                        { _id: '2', content: 'Nuevas estadísticas disponibles.', isRead: false }
                    ])
            })
        );

        render(
            <MemoryRouter>
                <Notificaciones />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Tienes una nueva mención en el foro.')).toBeInTheDocument();
            expect(screen.getByText('Nuevas estadísticas disponibles.')).toBeInTheDocument();
        });
    });

    it('Permite marcar una notificación como leída', async () => {
        // Mock para la autenticación
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );

        // Mock para las notificaciones
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { _id: '1', content: 'Tienes una nueva mención en el foro.', isRead: false },
                        { _id: '2', content: 'Nuevas estadísticas disponibles.', isRead: false }
                    ])
            })
        );

        // Mock para marcar como leída
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ _id: '1', isRead: true })
            })
        );

        render(
            <MemoryRouter>
                <Notificaciones />
            </MemoryRouter>
        );

        const markAsReadButtons = await screen.findAllByText('Marcar como leída', { selector: 'button' });

        // Marca como leída el primer botón
        markAsReadButtons[0].click();

        await waitFor(() => {
            expect(markAsReadButtons[0]).not.toBeInTheDocument();
        });
    });

    it('Redirige al login si el usuario no está autenticado', async () => {
        // Mock para fallar la autenticación
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 401
            })
        );

        render(
            <MemoryRouter>
                <Notificaciones />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/login');
        });
    });
});


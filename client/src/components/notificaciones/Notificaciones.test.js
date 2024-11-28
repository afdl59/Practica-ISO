import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Notificaciones from './Notificaciones';

// Mock para `fetch`
global.fetch = jest.fn();

describe('Notificaciones Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada test
    });

    it('Renderiza notificaciones correctamente', async () => {
        // Mock para la llamada a `fetch` que verifica la sesión
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );

        // Mock para la llamada a `fetch` que obtiene las notificaciones
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

        // Espera a que las notificaciones se rendericen
        await waitFor(() => {
            expect(screen.getByText('Tienes una nueva mención en el foro.')).toBeInTheDocument();
            expect(screen.getByText('Nuevas estadísticas disponibles.')).toBeInTheDocument();
        });
    });

    it('Muestra mensaje de error si el usuario no está autenticado', async () => {
        // Mock para la llamada a `fetch` que verifica la sesión (usuario no autenticado)
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

        // Verifica que no hay notificaciones renderizadas
        await waitFor(() => {
            expect(screen.queryByText('Tienes una nueva mención en el foro.')).not.toBeInTheDocument();
            expect(screen.queryByText('Nuevas estadísticas disponibles.')).not.toBeInTheDocument();
        });
    });

    it('Permite marcar una notificación como leída', async () => {
        // Mock para la llamada a `fetch` que verifica la sesión
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );

        // Mock para la llamada a `fetch` que obtiene las notificaciones
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

        // Mock para la llamada a `fetch` que marca la notificación como leída
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

        // Espera a que las notificaciones se rendericen
        await waitFor(() => {
            expect(screen.getByText('Tienes una nueva mención en el foro.')).toBeInTheDocument();
        });

        // Simula marcar como leída
        const markAsReadButton = screen.getByText('Marcar como leída', { selector: 'button' });
        markAsReadButton.click();

        // Verifica que la notificación se haya marcado como leída
        await waitFor(() => {
            expect(markAsReadButton).not.toBeInTheDocument();
        });
    });
});

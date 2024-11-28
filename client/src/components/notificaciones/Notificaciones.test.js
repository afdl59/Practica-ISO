import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Notificaciones from './Notificaciones';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate // Devuelve el mock directamente
}));

global.fetch = jest.fn();

describe('Notificaciones Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia mocks antes de cada prueba
    });

    it('Renderiza notificaciones correctamente', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );

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
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );

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

        markAsReadButtons[0].click();

        await waitFor(() => {
            expect(markAsReadButtons[0]).not.toBeInTheDocument();
        });
    });

    it('Redirige al login si el usuario no está autenticado', async () => {
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
            expect(mockedNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('Permite eliminar una notificación', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );
    
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
    
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ _id: '1' }) // Respuesta al eliminar
            })
        );
    
        render(
            <MemoryRouter>
                <Notificaciones />
            </MemoryRouter>
        );
    
        const deleteButtons = await screen.findAllByText('Eliminar', { selector: 'button' });
    
        // Simula eliminar la primera notificación
        deleteButtons[0].click();
    
        await waitFor(() => {
            expect(deleteButtons[0]).not.toBeInTheDocument();
        });
    });
    
    it('Permite marcar todas las notificaciones como leídas', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );
    
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
    
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true // Respuesta al marcar todas como leídas
            })
        );
    
        render(
            <MemoryRouter>
                <Notificaciones />
            </MemoryRouter>
        );
    
        const markAllButton = await screen.findByText('Marcar todas como leídas');
    
        markAllButton.click();
    
        await waitFor(() => {
            const unreadNotifications = screen.queryAllByText('Marcar como leída', { selector: 'button' });
            expect(unreadNotifications.length).toBe(0);
        });
    });
    
    it('Permite filtrar notificaciones por estado', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' })
            })
        );
    
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { _id: '1', content: 'Tienes una nueva mención en el foro.', isRead: true },
                        { _id: '2', content: 'Nuevas estadísticas disponibles.', isRead: false }
                    ])
            })
        );
    
        render(
            <MemoryRouter>
                <Notificaciones />
            </MemoryRouter>
        );
    
        const filterUnreadButton = await screen.findByText('No Leídas');
        const filterReadButton = await screen.findByText('Leídas');
    
        // Filtrar no leídas
        filterUnreadButton.click();
    
        await waitFor(() => {
            expect(screen.getByText('Nuevas estadísticas disponibles.')).toBeInTheDocument();
            expect(screen.queryByText('Tienes una nueva mención en el foro.')).not.toBeInTheDocument();
        });
    
        // Filtrar leídas
        filterReadButton.click();
    
        await waitFor(() => {
            expect(screen.getByText('Tienes una nueva mención en el foro.')).toBeInTheDocument();
            expect(screen.queryByText('Nuevas estadísticas disponibles.')).not.toBeInTheDocument();
        });
    });
    
});

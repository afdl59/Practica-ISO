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
});

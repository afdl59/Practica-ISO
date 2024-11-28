import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter
import App from './App';

test('renders learn react link', () => {
    render(
        <MemoryRouter> {/* Envuelve App en un MemoryRouter */}
            <App />
        </MemoryRouter>
    );
    
    const linkElement = screen.getByText(/learn react/i); // Ajusta esto según el texto esperado
    expect(linkElement).toBeInTheDocument();
});


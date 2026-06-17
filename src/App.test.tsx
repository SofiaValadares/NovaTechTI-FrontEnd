import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./context/ApiStatusContext', () => ({
  ApiStatusProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useApiStatus: () => ({
    status: 'online' as const,
    apiUrl: 'https://novateckti-backend.onrender.com',
    lastChecked: new Date(),
    refresh: jest.fn(),
  }),
}));

test('renderiza página inicial quando a API está online', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /bem-vindo à novatech ti/i })
  ).toBeInTheDocument();
});

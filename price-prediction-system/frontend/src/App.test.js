import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

test('renders PriceSpy brand in navigation', () => {
  render(<App />);
  expect(screen.getByText(/PriceSpy/i)).toBeInTheDocument();
});

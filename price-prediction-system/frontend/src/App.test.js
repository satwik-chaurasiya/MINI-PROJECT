import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    BrowserRouter: ({ children }) => <div data-testid="router-container">{children}</div>,
    Routes: ({ children }) => {
      const childArray = React.Children.toArray(children);
      const rootRoute = childArray.find(c => c && c.props && c.props.path === '/') || childArray[0];
      return <div data-testid="routes-container">{rootRoute ? rootRoute.props.element : null}</div>;
    },
    Route: ({ element }) => element || null,
    Link: ({ to, children, className, ...rest }) => (
      <a href={to} className={className} {...rest}>
        {children}
      </a>
    ),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({ id: 'prod_iphone15_128' }),
  };
});

test('renders PriceSpy brand in navigation', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/PriceSpy/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

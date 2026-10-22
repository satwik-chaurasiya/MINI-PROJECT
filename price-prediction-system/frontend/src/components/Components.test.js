import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './EmptyState';
import { CardSkeleton, TableRowSkeleton, DetailSkeleton } from './LoadingSkeleton';
import Toast from './Toast';
import NotFoundPage from '../pages/NotFoundPage';

jest.mock('react-router-dom', () => {
  return {
    Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>,
    useNavigate: () => jest.fn(),
  };
});

describe('UI-UX Pro Max Core Components', () => {
  test('EmptyState renders title, description, and calls action', () => {
    const handleAction = jest.fn();
    render(
      <EmptyState
        title="No Tracked Items"
        description="Your watchlist is currently empty."
        actionLabel="Explore Deals"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Tracked Items')).toBeInTheDocument();
    expect(screen.getByText('Your watchlist is currently empty.')).toBeInTheDocument();

    const button = screen.getByText('Explore Deals');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  test('LoadingSkeleton variants render with animate-pulse', () => {
    const { container: cardContainer } = render(<CardSkeleton count={2} />);
    expect(cardContainer.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);

    const { container: tableContainer } = render(
      <table>
        <tbody>
          <TableRowSkeleton columns={4} rows={3} />
        </tbody>
      </table>
    );
    expect(tableContainer.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);

    const { container: detailContainer } = render(<DetailSkeleton />);
    expect(detailContainer.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  test('Toast displays message and closes on dismiss', () => {
    const handleClose = jest.fn();
    render(
      <Toast
        type="success"
        message="Alert created successfully!"
        onClose={handleClose}
      />
    );

    expect(screen.getByText('Alert created successfully!')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('NotFoundPage renders 404 error and navigation links', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/Error 404/i)).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Compare Products')).toBeInTheDocument();
  });
});

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConfirmedBooking from '../pages/ConfirmedBooking';

const booking = {
  date: '2030-01-15',
  time: '19:00',
  guests: 1,
  occasion: 'Birthday',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '',
  requests: 'Window seat please',
};

function renderWithState(state) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/confirmed', state }]}>
      <ConfirmedBooking />
    </MemoryRouter>
  );
}

describe('ConfirmedBooking', () => {
  it('shows the booking summary', () => {
    renderWithState({ booking });
    const heading = screen.getByRole('heading', { name: /your table is booked/i });
    expect(heading).toHaveFocus();
    expect(screen.getByText('Tuesday, January 15, 2030')).toBeInTheDocument();
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('1 guest')).toBeInTheDocument();
    expect(screen.getByText('Birthday')).toBeInTheDocument();
    expect(screen.getByText('Window seat please')).toBeInTheDocument();
  });

  it('omits optional rows that were left empty', () => {
    renderWithState({ booking: { ...booking, occasion: '', requests: '', guests: 4 } });
    expect(screen.getByText('4 guests')).toBeInTheDocument();
    expect(screen.queryByText('Occasion')).not.toBeInTheDocument();
    expect(screen.queryByText('Special requests')).not.toBeInTheDocument();
  });

  it('handles a direct visit without booking details', () => {
    renderWithState(undefined);
    expect(screen.getByRole('heading', { name: /no reservation found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /make a reservation/i })).toHaveAttribute(
      'href',
      '/booking'
    );
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookingPage, {
  SUBMIT_FAILED_MESSAGE,
  SUBMIT_REJECTED_MESSAGE,
} from '../pages/BookingPage';
import ConfirmedBooking from '../pages/ConfirmedBooking';

function renderPage(submit) {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/booking']}>
      <Routes>
        <Route path="/booking" element={<BookingPage submit={submit} />} />
        <Route path="/confirmed" element={<ConfirmedBooking />} />
      </Routes>
    </MemoryRouter>
  );
  return user;
}

async function completeBooking(user) {
  const timeSelect = screen.getByLabelText(/choose time/i);
  const firstTime = timeSelect.querySelectorAll('option')[1].value;
  await user.selectOptions(timeSelect, firstTime);
  await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
  await user.click(screen.getByRole('button', { name: /make your reservation/i }));
  return firstTime;
}

describe('BookingPage', () => {
  it('renders the page heading and the form with today’s times', () => {
    renderPage(vi.fn());
    expect(screen.getByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
    const options = screen.getByLabelText(/choose time/i).querySelectorAll('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('navigates to the confirmation page after a successful booking', async () => {
    const submit = vi.fn().mockResolvedValue(true);
    const user = renderPage(submit);
    const time = await completeBooking(user);

    expect(submit).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole('heading', { name: /your table is booked/i })
    ).toBeInTheDocument();
    expect(screen.getByText(time)).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });

  it('shows a meaningful message when the booking is rejected', async () => {
    const user = renderPage(vi.fn().mockResolvedValue(false));
    await completeBooking(user);

    expect(await screen.findByText(SUBMIT_REJECTED_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeEnabled();
  });

  it('shows a meaningful message when the API throws', async () => {
    const user = renderPage(vi.fn().mockRejectedValue(new Error('Network down')));
    await completeBooking(user);

    expect(await screen.findByText(SUBMIT_FAILED_MESSAGE)).toBeInTheDocument();
  });
});

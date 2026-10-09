import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../components/BookingForm';
import { UPDATE_TIMES } from '../utils/timesReducer';

const today = new Date(2030, 0, 15);
const availableTimes = ['17:00', '18:30', '20:00'];

function renderForm(props = {}) {
  const dispatch = vi.fn();
  const submitForm = vi.fn();
  const user = userEvent.setup();
  render(
    <BookingForm
      availableTimes={availableTimes}
      dispatch={dispatch}
      submitForm={submitForm}
      today={today}
      {...props}
    />
  );
  return { dispatch, submitForm, user };
}

async function fillValidForm(user) {
  await user.selectOptions(screen.getByLabelText(/choose time/i), '18:30');
  await user.selectOptions(screen.getByLabelText(/occasion/i), 'Anniversary');
  await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
}

describe('BookingForm', () => {
  it('renders every field with an accessible label', () => {
    renderForm();
    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeInTheDocument();
  });

  it('applies HTML5 validation attributes', () => {
    renderForm();
    const date = screen.getByLabelText(/choose date/i);
    expect(date).toHaveAttribute('type', 'date');
    expect(date).toBeRequired();
    expect(date).toHaveAttribute('min', '2030-01-15');
    expect(date).toHaveAttribute('max', '2030-04-15');

    const guests = screen.getByLabelText(/number of guests/i);
    expect(guests).toHaveAttribute('type', 'number');
    expect(guests).toHaveAttribute('min', '1');
    expect(guests).toHaveAttribute('max', '10');
    expect(guests).toBeRequired();

    expect(screen.getByLabelText(/choose time/i)).toBeRequired();
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/^email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/special requests/i)).toHaveAttribute('maxLength', '200');
  });

  it('lists the available times passed in as props', () => {
    renderForm();
    const options = screen.getAllByRole('option', { name: /^\d{2}:\d{2}$/ });
    expect(options.map((o) => o.value)).toEqual(availableTimes);
  });

  it('dispatches UPDATE_TIMES with the new date when the date changes', () => {
    const { dispatch } = renderForm();
    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: '2030-01-20' } });
    expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_TIMES, date: '2030-01-20' });
  });

  it('submits clean, typed form data when everything is valid', async () => {
    const { submitForm, user } = renderForm();
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledWith({
      date: '2030-01-15',
      time: '18:30',
      guests: 2,
      occasion: 'Anniversary',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '',
      requests: '',
    });
  });

  it('does not submit an empty form and shows an error summary', async () => {
    const { submitForm, user } = renderForm();
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(submitForm).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/please fix 3 errors/i);
    expect(screen.getByText('Please choose a time.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
  });

  it('moves focus to the first invalid field on a failed submit', async () => {
    const { user } = renderForm();
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));
    expect(screen.getByLabelText(/choose time/i)).toHaveFocus();
  });

  it('shows a field error only after the field is touched', async () => {
    const { user } = renderForm();
    const email = screen.getByLabelText(/^email/i);
    await user.type(email, 'not-an-email');
    expect(screen.queryByText(/valid email address/i)).not.toBeInTheDocument();

    await user.tab();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email.getAttribute('aria-describedby')).toContain('email-error');
  });

  it('rejects a party size outside 1–10', async () => {
    const { submitForm, user } = renderForm();
    await fillValidForm(user);
    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '12');
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(submitForm).not.toHaveBeenCalled();
    expect(screen.getByText(/parties larger than 10/i)).toBeInTheDocument();
    expect(guests).toHaveFocus();
  });

  it('rejects a date in the past', async () => {
    const { submitForm, user } = renderForm();
    await fillValidForm(user);
    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: '2030-01-01' } });
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(submitForm).not.toHaveBeenCalled();
    expect(screen.getByText('The date cannot be in the past.')).toBeInTheDocument();
  });

  it('clears the selected time when the date changes', async () => {
    const { user } = renderForm();
    const time = screen.getByLabelText(/choose time/i);
    await user.selectOptions(time, '18:30');
    expect(time).toHaveValue('18:30');

    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: '2030-01-20' } });
    expect(time).toHaveValue('');
  });

  it('tells the user when a date is fully booked', () => {
    renderForm({ availableTimes: [] });
    expect(screen.getByLabelText(/choose time/i)).toBeDisabled();
    expect(screen.getByText(/fully booked on this date/i)).toBeInTheDocument();
  });

  it('shows the API error message passed from the page', () => {
    renderForm({ submitError: 'We could not complete your reservation.' });
    expect(screen.getByRole('alert')).toHaveTextContent('We could not complete your reservation.');
  });

  it('disables the submit button while submitting', () => {
    renderForm({ isSubmitting: true });
    expect(screen.getByRole('button', { name: /booking/i })).toBeDisabled();
  });

  it('shows a live character count for special requests', async () => {
    const { user } = renderForm();
    await user.type(screen.getByLabelText(/special requests/i), 'Window seat');
    expect(screen.getByText('11/200 characters')).toBeInTheDocument();
  });
});

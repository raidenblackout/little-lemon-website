import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatLongDate } from '../utils/dates';

export default function ConfirmedBooking() {
  useDocumentTitle('Booking Confirmed');
  const { state } = useLocation();
  const booking = state?.booking;
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!booking) {
    return (
      <section className="section confirmation" aria-labelledby="confirm-heading">
        <div className="container container--narrow">
          <h1 id="confirm-heading" ref={headingRef} tabIndex={-1} className="section-title">
            No reservation found
          </h1>
          <p>
            We couldn&apos;t find booking details to show. If you just made a reservation, check
            your email for the confirmation.
          </p>
          <Link to="/booking" className="button button--primary">
            Make a reservation
          </Link>
        </div>
      </section>
    );
  }

  const guestLabel = booking.guests === 1 ? 'guest' : 'guests';

  return (
    <section className="section confirmation" aria-labelledby="confirm-heading">
      <div className="container container--narrow">
        <p className="confirmation__icon" aria-hidden="true">
          ✓
        </p>
        <h1 id="confirm-heading" ref={headingRef} tabIndex={-1} className="section-title">
          Your table is booked!
        </h1>
        <p>
          Thank you, {booking.name}. A confirmation has been sent to{' '}
          <strong>{booking.email}</strong>.
        </p>

        <dl className="summary">
          <div>
            <dt>Date</dt>
            <dd>{formatLongDate(booking.date)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{booking.time}</dd>
          </div>
          <div>
            <dt>Party size</dt>
            <dd>
              {booking.guests} {guestLabel}
            </dd>
          </div>
          {booking.occasion && (
            <div>
              <dt>Occasion</dt>
              <dd>{booking.occasion}</dd>
            </div>
          )}
          {booking.requests && (
            <div>
              <dt>Special requests</dt>
              <dd>{booking.requests}</dd>
            </div>
          )}
        </dl>

        <Link to="/" className="button button--secondary">
          Back to home
        </Link>
      </div>
    </section>
  );
}

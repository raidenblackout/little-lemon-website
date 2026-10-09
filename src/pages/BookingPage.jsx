import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { submitAPI } from '../api/api';
import { initializeTimes, updateTimes } from '../utils/timesReducer';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { RESTAURANT } from '../data/content';

export const SUBMIT_REJECTED_MESSAGE =
  'We could not complete your reservation. Please check your details and try again.';
export const SUBMIT_FAILED_MESSAGE =
  'Something went wrong while contacting the restaurant. Please try again in a moment, or call us to book.';

export default function BookingPage({ submit = submitAPI }) {
  useDocumentTitle('Reserve a Table');
  const navigate = useNavigate();
  const [availableTimes, dispatch] = useReducer(updateTimes, undefined, () => initializeTimes());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function submitForm(formData) {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const accepted = await submit(formData);
      if (accepted) {
        navigate('/confirmed', { state: { booking: formData } });
        return;
      }
      setSubmitError(SUBMIT_REJECTED_MESSAGE);
    } catch {
      setSubmitError(SUBMIT_FAILED_MESSAGE);
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <section className="page-banner" aria-labelledby="booking-heading">
        <div className="container">
          <h1 id="booking-heading" className="display-title">
            Reserve a Table
          </h1>
          <p className="subtitle">{RESTAURANT.name}, {RESTAURANT.city}</p>
          <p className="lead">
            Pick a date and time and we&apos;ll have your table ready. For parties larger than
            10, please call us at <a href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a>.
          </p>
        </div>
      </section>
      <section className="section" aria-label="Booking form">
        <div className="container container--narrow">
          <BookingForm
            availableTimes={availableTimes}
            dispatch={dispatch}
            submitForm={submitForm}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      </section>
    </>
  );
}

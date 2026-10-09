import { useRef, useState } from 'react';
import { UPDATE_TIMES } from '../utils/timesReducer';
import { addDays, toISODate } from '../utils/dates';
import { BOOKING_RULES, OCCASIONS, isValid, validateBooking } from '../utils/validation';

const FIELD_ORDER = ['date', 'time', 'guests', 'occasion', 'name', 'email', 'phone', 'requests'];

export default function BookingForm({
  availableTimes,
  dispatch,
  submitForm,
  isSubmitting = false,
  submitError = '',
  today = new Date(),
}) {
  const minDate = toISODate(today);
  const maxDate = toISODate(addDays(today, BOOKING_RULES.maxDaysAhead));

  const [values, setValues] = useState({
    date: minDate,
    time: '',
    guests: '2',
    occasion: '',
    name: '',
    email: '',
    phone: '',
    requests: '',
  });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef(null);
  const summaryRef = useRef(null);

  const errors = validateBooking(values, { availableTimes, today });
  const formIsValid = isValid(errors);
  const errorCount = Object.keys(errors).length;

  const showError = (field) => Boolean(errors[field] && (touched[field] || submitAttempted));

  const fieldProps = (field, describedBy = []) => {
    const ids = [...describedBy];
    if (showError(field)) ids.push(`${field}-error`);
    return {
      id: field,
      name: field,
      value: values[field],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': showError(field) ? 'true' : 'false',
      'aria-describedby': ids.length ? ids.join(' ') : undefined,
    };
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleDateChange(event) {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, date: value, time: '' }));
    setTouched((prev) => ({ ...prev, date: true }));
    dispatch({ type: UPDATE_TIMES, date: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!formIsValid) {
      const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
      const element = formRef.current?.elements.namedItem(firstInvalid);
      if (element && !element.disabled) {
        element.focus();
      } else {
        setTimeout(() => summaryRef.current?.focus(), 0);
      }
      return;
    }

    submitForm({
      date: values.date,
      time: values.time,
      guests: Number(values.guests),
      occasion: values.occasion,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      requests: values.requests.trim(),
    });
  }

  const noTimes = availableTimes.length === 0;

  return (
    <form
      ref={formRef}
      className="booking-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="booking-form-heading"
    >
      <h2 id="booking-form-heading" className="visually-hidden">
        Reservation details
      </h2>

      <p className="form-note">
        Fields marked with <span aria-hidden="true">*</span>
        <span className="visually-hidden">an asterisk</span> are required.
      </p>

      {submitAttempted && !formIsValid && (
        <div ref={summaryRef} className="alert alert--error" role="alert" tabIndex={-1}>
          Please fix {errorCount} {errorCount === 1 ? 'error' : 'errors'} before submitting.
        </div>
      )}

      {submitError && (
        <div className="alert alert--error" role="alert">
          {submitError}
        </div>
      )}

      <fieldset className="form-section">
        <legend>When &amp; who</legend>

        <div className="form-field">
          <label htmlFor="date">
            Choose date <span aria-hidden="true">*</span>
          </label>
          <input
            type="date"
            required
            min={minDate}
            max={maxDate}
            {...fieldProps('date', ['date-hint'])}
            onChange={handleDateChange}
          />
          <p id="date-hint" className="field-hint">
            Book up to {BOOKING_RULES.maxDaysAhead} days ahead.
          </p>
          {showError('date') && (
            <p id="date-error" className="field-error">
              {errors.date}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="time">
            Choose time <span aria-hidden="true">*</span>
          </label>
          <select required disabled={noTimes} {...fieldProps('time')}>
            <option value="">{noTimes ? 'No times available' : 'Select a time'}</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {(showError('time') || (noTimes && !errors.date)) && (
            <p id="time-error" className="field-error" role={noTimes ? 'status' : undefined}>
              {errors.time}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="guests">
            Number of guests <span aria-hidden="true">*</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            required
            min={BOOKING_RULES.minGuests}
            max={BOOKING_RULES.maxGuests}
            step="1"
            {...fieldProps('guests', ['guests-hint'])}
          />
          <p id="guests-hint" className="field-hint">
            {BOOKING_RULES.minGuests}–{BOOKING_RULES.maxGuests} guests.
          </p>
          {showError('guests') && (
            <p id="guests-error" className="field-error">
              {errors.guests}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="occasion">Occasion</label>
          <select {...fieldProps('occasion')}>
            <option value="">None</option>
            {OCCASIONS.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
          {showError('occasion') && (
            <p id="occasion-error" className="field-error">
              {errors.occasion}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Your details</legend>

        <div className="form-field">
          <label htmlFor="name">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            autoComplete="name"
            required
            minLength={BOOKING_RULES.nameMinLength}
            maxLength={BOOKING_RULES.nameMaxLength}
            {...fieldProps('name')}
          />
          {showError('name') && (
            <p id="name-error" className="field-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            {...fieldProps('email', ['email-hint'])}
          />
          <p id="email-hint" className="field-hint">
            We&apos;ll send your confirmation here.
          </p>
          {showError('email') && (
            <p id="email-error" className="field-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone (optional)</label>
          <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
          {showError('phone') && (
            <p id="phone-error" className="field-error">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="requests">Special requests (optional)</label>
          <textarea
            rows="3"
            maxLength={BOOKING_RULES.requestsMaxLength}
            {...fieldProps('requests', ['requests-count'])}
          />
          <p id="requests-count" className="field-hint">
            {values.requests.length}/{BOOKING_RULES.requestsMaxLength} characters
          </p>
          {showError('requests') && (
            <p id="requests-error" className="field-error">
              {errors.requests}
            </p>
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        className="button button--primary button--block"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? 'Booking…' : 'Make Your Reservation'}
      </button>
    </form>
  );
}

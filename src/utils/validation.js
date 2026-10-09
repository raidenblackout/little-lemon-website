import { addDays, parseISODate } from './dates';

export const BOOKING_RULES = {
  minGuests: 1,
  maxGuests: 10,
  maxDaysAhead: 90,
  nameMinLength: 2,
  nameMaxLength: 50,
  requestsMaxLength: 200,
};

export const OCCASIONS = ['Birthday', 'Anniversary', 'Business', 'Other'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^\p{L}[\p{L}\s'.-]*$/u;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

export function validateBooking(values, { availableTimes = [], today = new Date() } = {}) {
  const errors = {};
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (!values.date) {
    errors.date = 'Please choose a date.';
  } else {
    const date = parseISODate(values.date);
    if (!date) {
      errors.date = 'Please enter a valid date.';
    } else if (date < startOfToday) {
      errors.date = 'The date cannot be in the past.';
    } else if (date > addDays(startOfToday, BOOKING_RULES.maxDaysAhead)) {
      errors.date = `Bookings open up to ${BOOKING_RULES.maxDaysAhead} days in advance.`;
    }
  }

  if (!errors.date) {
    if (availableTimes.length === 0) {
      errors.time = 'Sorry, we are fully booked on this date. Please choose another day.';
    } else if (!values.time) {
      errors.time = 'Please choose a time.';
    } else if (!availableTimes.includes(values.time)) {
      errors.time = 'That time is no longer available. Please choose another.';
    }
  }

  const rawGuests = values.guests;
  const guests = Number(rawGuests);
  if (rawGuests === '' || rawGuests === undefined || rawGuests === null) {
    errors.guests = 'Please enter the number of guests.';
  } else if (!Number.isInteger(guests)) {
    errors.guests = 'Number of guests must be a whole number.';
  } else if (guests < BOOKING_RULES.minGuests) {
    errors.guests = `At least ${BOOKING_RULES.minGuests} guest is required.`;
  } else if (guests > BOOKING_RULES.maxGuests) {
    errors.guests = `For parties larger than ${BOOKING_RULES.maxGuests}, please call us.`;
  }

  if (values.occasion && !OCCASIONS.includes(values.occasion)) {
    errors.occasion = 'Please choose an occasion from the list.';
  }

  const name = (values.name || '').trim();
  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length < BOOKING_RULES.nameMinLength) {
    errors.name = `Name must be at least ${BOOKING_RULES.nameMinLength} characters.`;
  } else if (name.length > BOOKING_RULES.nameMaxLength) {
    errors.name = `Name must be ${BOOKING_RULES.nameMaxLength} characters or fewer.`;
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = 'Name can only contain letters, spaces, hyphens and apostrophes.';
  }

  const email = (values.email || '').trim();
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address, e.g. name@example.com.';
  }

  const phone = (values.phone || '').trim();
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (!PHONE_PATTERN.test(phone) || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Please enter a valid phone number, or leave it blank.';
    }
  }

  if ((values.requests || '').length > BOOKING_RULES.requestsMaxLength) {
    errors.requests = `Special requests must be ${BOOKING_RULES.requestsMaxLength} characters or fewer.`;
  }

  return errors;
}

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}

import { describe, expect, it } from 'vitest';
import { BOOKING_RULES, isValid, validateBooking } from '../utils/validation';

const today = new Date(2030, 0, 15);
const availableTimes = ['17:00', '18:30', '20:00'];
const context = { availableTimes, today };

const valid = {
  date: '2030-01-20',
  time: '18:30',
  guests: '4',
  occasion: 'Birthday',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '',
  requests: '',
};

const errorsFor = (overrides) => validateBooking({ ...valid, ...overrides }, context);

describe('validateBooking', () => {
  it('returns no errors for a valid booking', () => {
    expect(validateBooking(valid, context)).toEqual({});
    expect(isValid(validateBooking(valid, context))).toBe(true);
  });

  describe('date', () => {
    it('is required', () => {
      expect(errorsFor({ date: '' }).date).toBe('Please choose a date.');
    });

    it('accepts today', () => {
      expect(errorsFor({ date: '2030-01-15' }).date).toBeUndefined();
    });

    it('rejects dates in the past', () => {
      expect(errorsFor({ date: '2030-01-14' }).date).toBe('The date cannot be in the past.');
    });

    it(`rejects dates more than ${BOOKING_RULES.maxDaysAhead} days ahead`, () => {
      expect(errorsFor({ date: '2030-12-31' }).date).toMatch(/days in advance/);
    });

    it('rejects impossible dates', () => {
      expect(errorsFor({ date: '2030-02-30' }).date).toBe('Please enter a valid date.');
    });
  });

  describe('time', () => {
    it('is required', () => {
      expect(errorsFor({ time: '' }).time).toBe('Please choose a time.');
    });

    it('must be one of the available times', () => {
      expect(errorsFor({ time: '23:30' }).time).toMatch(/no longer available/);
    });

    it('explains when the date is fully booked', () => {
      const errors = validateBooking(valid, { availableTimes: [], today });
      expect(errors.time).toMatch(/fully booked/);
    });

    it('is not validated while the date itself is invalid', () => {
      expect(errorsFor({ date: '', time: '' }).time).toBeUndefined();
    });
  });

  describe('guests', () => {
    it.each([
      ['', 'Please enter the number of guests.'],
      ['0', 'At least 1 guest is required.'],
      ['-3', 'At least 1 guest is required.'],
      ['11', 'For parties larger than 10, please call us.'],
      ['2.5', 'Number of guests must be a whole number.'],
      ['abc', 'Number of guests must be a whole number.'],
    ])('rejects %j', (guests, message) => {
      expect(errorsFor({ guests }).guests).toBe(message);
    });

    it.each(['1', '10'])('accepts the boundary value %s', (guests) => {
      expect(errorsFor({ guests }).guests).toBeUndefined();
    });
  });

  describe('occasion', () => {
    it('is optional', () => {
      expect(errorsFor({ occasion: '' }).occasion).toBeUndefined();
    });

    it('rejects values that are not in the list', () => {
      expect(errorsFor({ occasion: 'Wedding' }).occasion).toBeDefined();
    });
  });

  describe('name', () => {
    it('is required (whitespace only does not count)', () => {
      expect(errorsFor({ name: '   ' }).name).toBe('Please enter your name.');
    });

    it('must be at least 2 characters', () => {
      expect(errorsFor({ name: 'A' }).name).toMatch(/at least 2/);
    });

    it('must be at most 50 characters', () => {
      expect(errorsFor({ name: 'A'.repeat(51) }).name).toMatch(/50 characters or fewer/);
    });

    it('rejects digits and symbols', () => {
      expect(errorsFor({ name: 'R2-D2' }).name).toMatch(/only contain letters/);
      expect(errorsFor({ name: '<script>' }).name).toMatch(/only contain letters/);
    });

    it.each(["Mary-Jane O'Neil", 'José Álvarez', 'J. R. Smith'])('accepts %s', (name) => {
      expect(errorsFor({ name }).name).toBeUndefined();
    });
  });

  describe('email', () => {
    it('is required', () => {
      expect(errorsFor({ email: '' }).email).toBe('Please enter your email address.');
    });

    it.each(['ada', 'ada@', 'ada@example', 'ada @example.com', '@example.com'])(
      'rejects %s',
      (email) => {
        expect(errorsFor({ email }).email).toMatch(/valid email/);
      }
    );

    it('ignores surrounding whitespace', () => {
      expect(errorsFor({ email: '  ada@example.com  ' }).email).toBeUndefined();
    });
  });

  describe('phone', () => {
    it('is optional', () => {
      expect(errorsFor({ phone: '' }).phone).toBeUndefined();
    });

    it.each(['(312) 593-2744', '+1 312 593 2744'])('accepts %s', (phone) => {
      expect(errorsFor({ phone }).phone).toBeUndefined();
    });

    it.each(['123', 'call me', '+1 (312) 593-2744 ext 12345678'])('rejects %s', (phone) => {
      expect(errorsFor({ phone }).phone).toBeDefined();
    });
  });

  describe('special requests', () => {
    it('rejects text over the character limit', () => {
      const requests = 'x'.repeat(BOOKING_RULES.requestsMaxLength + 1);
      expect(errorsFor({ requests }).requests).toBeDefined();
    });
  });
});

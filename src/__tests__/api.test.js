import { describe, expect, it } from 'vitest';
import { fetchAPI, submitAPI } from '../api/api';

describe('fetchAPI', () => {
  it('returns times in HH:MM format between 17:00 and 23:30', () => {
    const times = fetchAPI(new Date(2030, 0, 15));
    times.forEach((time) => expect(time).toMatch(/^(1[7-9]|2[0-3]):(00|30)$/));
  });

  it('is deterministic for the same date', () => {
    const date = new Date(2030, 0, 15);
    expect(fetchAPI(date)).toEqual(fetchAPI(new Date(date)));
  });

  it('returns at least one slot for every day of the month', () => {
    for (let day = 1; day <= 31; day += 1) {
      expect(fetchAPI(new Date(2030, 0, day)).length).toBeGreaterThan(0);
    }
  });

  it('returns an empty list for invalid input', () => {
    expect(fetchAPI(new Date('not a date'))).toEqual([]);
    expect(fetchAPI('2030-01-15')).toEqual([]);
    expect(fetchAPI(undefined)).toEqual([]);
  });
});

describe('submitAPI', () => {
  const booking = {
    date: '2030-01-15',
    time: '18:00',
    guests: 2,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  };

  it('accepts a complete booking', () => {
    expect(submitAPI(booking)).toBe(true);
  });

  it('rejects a booking with a missing required field', () => {
    expect(submitAPI({ ...booking, email: '' })).toBe(false);
    expect(submitAPI({ ...booking, time: undefined })).toBe(false);
  });

  it('rejects missing form data', () => {
    expect(submitAPI(null)).toBe(false);
  });
});

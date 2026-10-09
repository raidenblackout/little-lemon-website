import { describe, expect, it } from 'vitest';
import { addDays, formatLongDate, parseISODate, toISODate } from '../utils/dates';

describe('date helpers', () => {
  it('formats a Date as YYYY-MM-DD with zero padding', () => {
    expect(toISODate(new Date(2030, 0, 5))).toBe('2030-01-05');
  });

  it('parses YYYY-MM-DD as a local date (no timezone shift)', () => {
    const date = parseISODate('2030-03-09');
    expect(date.getFullYear()).toBe(2030);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(9);
  });

  it('rejects impossible or malformed dates', () => {
    expect(parseISODate('2030-02-30')).toBeNull();
    expect(parseISODate('2030-13-01')).toBeNull();
    expect(parseISODate('15/01/2030')).toBeNull();
    expect(parseISODate('')).toBeNull();
    expect(parseISODate(undefined)).toBeNull();
  });

  it('adds days across month boundaries', () => {
    expect(toISODate(addDays(new Date(2030, 0, 30), 3))).toBe('2030-02-02');
  });

  it('formats a long, human-readable date', () => {
    expect(formatLongDate('2030-01-15')).toBe('Tuesday, January 15, 2030');
  });
});

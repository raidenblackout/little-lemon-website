import { describe, expect, it } from 'vitest';
import { fetchAPI } from '../api/api';
import { UPDATE_TIMES, initializeTimes, updateTimes } from '../utils/timesReducer';

describe('initializeTimes', () => {
  it('returns a non-empty list of times for today', () => {
    const times = initializeTimes();
    expect(Array.isArray(times)).toBe(true);
    expect(times.length).toBeGreaterThan(0);
  });

  it('returns the same times the API reports for the given day', () => {
    const day = new Date(2030, 0, 15);
    expect(initializeTimes(day)).toEqual(fetchAPI(day));
  });
});

describe('updateTimes', () => {
  it('returns the available times for the selected date', () => {
    const state = ['17:00'];
    const result = updateTimes(state, { type: UPDATE_TIMES, date: '2030-01-20' });
    expect(result).toEqual(fetchAPI(new Date(2030, 0, 20)));
  });

  it('returns an empty list when the date is invalid', () => {
    expect(updateTimes(['17:00'], { type: UPDATE_TIMES, date: '' })).toEqual([]);
    expect(updateTimes(['17:00'], { type: UPDATE_TIMES, date: '2030-02-31' })).toEqual([]);
  });

  it('returns the current state for unknown actions', () => {
    const state = ['17:00', '18:00'];
    expect(updateTimes(state, { type: 'UNKNOWN' })).toBe(state);
  });
});

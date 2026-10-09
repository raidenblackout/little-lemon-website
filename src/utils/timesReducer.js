import { fetchAPI } from '../api/api';
import { parseISODate } from './dates';

export const UPDATE_TIMES = 'UPDATE_TIMES';

export function initializeTimes(today = new Date()) {
  return fetchAPI(today);
}

export function updateTimes(state, action) {
  switch (action.type) {
    case UPDATE_TIMES: {
      const date = parseISODate(action.date);
      return date ? fetchAPI(date) : [];
    }
    default:
      return state;
  }
}

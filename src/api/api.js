function seededRandom(seed) {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => {
    s = (s * a) % m;
    return s / m;
  };
}

export function fetchAPI(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return [];
  }

  const random = seededRandom(date.getDate());
  const times = [];
  for (let hour = 17; hour <= 23; hour += 1) {
    if (random() < 0.5) times.push(`${hour}:00`);
    if (random() < 0.5) times.push(`${hour}:30`);
  }
  return times;
}

export function submitAPI(formData) {
  if (!formData) return false;
  const required = ['date', 'time', 'guests', 'name', 'email'];
  return required.every((field) => Boolean(formData[field]));
}

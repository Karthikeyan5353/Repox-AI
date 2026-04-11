export function getDateRange(filter = '30d') {
  const now = new Date();
  const start = new Date(now);
  const days = filter === '7d' ? 7 : 30;
  start.setDate(start.getDate() - days);
  return { start, end: now, days };
}

export function buildDateBuckets(days) {
  const buckets = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - index);
    buckets.push({
      key: date.toISOString().slice(0, 10),
      date,
      value: 0,
    });
  }

  return buckets;
}

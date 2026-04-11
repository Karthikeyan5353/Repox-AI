export function formatDate(value) {
  if (!value) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatCompactNumber(value = 0) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDurationHours(value = 0) {
  return `${value}h`;
}

export function statusTone(severity) {
  if (severity === 'high') {
    return 'bg-rose-500/15 text-rose-200 border border-rose-400/20';
  }

  if (severity === 'medium') {
    return 'bg-amber-500/15 text-amber-100 border border-amber-400/20';
  }

  return 'bg-cyan-500/15 text-cyan-100 border border-cyan-400/20';
}

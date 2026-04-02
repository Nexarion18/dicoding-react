const intervals = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'week', seconds: 604800 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 }
]

export const formatRelativeTime = (dateString) => {
  const formatter = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })
  const value = (new Date(dateString).getTime() - Date.now()) / 1000
  for (const interval of intervals) {
    const delta = value / interval.seconds
    if (Math.abs(delta) >= 1) {
      return formatter.format(Math.round(delta), interval.label)
    }
  }
  return 'baru saja'
}

export const formatFullDate = (dateString) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString))
}

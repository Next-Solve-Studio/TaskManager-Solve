export const formatDateInput = (date) => {
  if (!date) return ''

  const d = typeof date.toDate === 'function'
    ? date.toDate()
    : new Date(date)

  // biome-ignore lint/suspicious/noGlobalIsNan: <>
  if (isNaN(d.getTime())) return ''

  return d.toISOString().split('T')[0] // yyyy-MM-dd
}

export const parseDate = (date) => {
  if (!date) return null

  if (typeof date.toDate === 'function') return date.toDate()

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date
  }

  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(advancedFormat)

export { dayjs }

export interface TimeParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** True once the target moment has passed */
  isPast: boolean
}

const ZERO: TimeParts = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }

/** Distance from now to an ISO target, floored at zero. */
export function getTimeParts(targetIso: string): TimeParts {
  const target = dayjs(targetIso)
  if (!target.isValid()) return ZERO

  const diff = target.diff(dayjs())
  if (diff <= 0) return ZERO

  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  }
}

export const formatDate = (iso: string, template = 'DD MMMM YYYY') => dayjs(iso).format(template)
export const formatTime = (iso: string) => dayjs(iso).format('h:mm A')
export const formatDay = (iso: string) => dayjs(iso).format('dddd')

/** Zero-pad for the countdown readout. */
export const pad = (n: number, len = 2) => String(Math.max(0, n)).padStart(len, '0')

/**
 * Google Calendar "add event" URL. Times are converted to UTC basic format,
 * which is what the endpoint expects.
 */
export function googleCalendarUrl(opts: {
  title: string
  startIso: string
  durationHours?: number
  details?: string
  location?: string
}): string {
  const fmt = (d: dayjs.Dayjs) => d.utc().format('YYYYMMDDTHHmmss[Z]')
  const start = dayjs(opts.startIso)
  const end = start.add(opts.durationHours ?? 2, 'hour')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: opts.details ?? '',
    location: opts.location ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

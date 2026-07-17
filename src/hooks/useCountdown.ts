import { useEffect, useState } from 'react'
import { getTimeParts, type TimeParts } from '../utils/date'

/**
 * Ticking countdown to an ISO target.
 *
 * Re-derives from the wall clock on every tick rather than decrementing, so it
 * stays correct across tab sleep, and pauses entirely while the tab is hidden.
 */
export function useCountdown(targetIso: string): TimeParts {
  const [parts, setParts] = useState<TimeParts>(() => getTimeParts(targetIso))

  useEffect(() => {
    let timer: number | undefined

    const tick = () => setParts(getTimeParts(targetIso))

    const start = () => {
      tick()
      // Align to the next whole second so the digits flip on the beat
      const delay = 1000 - (Date.now() % 1000)
      timer = window.setTimeout(() => {
        tick()
        timer = window.setInterval(tick, 1000)
      }, delay)
    }

    const stop = () => {
      if (timer !== undefined) {
        clearTimeout(timer)
        clearInterval(timer)
        timer = undefined
      }
    }

    const onVisibility = () => {
      stop()
      if (!document.hidden) start()
    }

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [targetIso])

  return parts
}

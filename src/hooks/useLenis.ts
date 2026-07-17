import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

/**
 * Lenis smooth scroll, driven by GSAP's ticker.
 *
 * Two deliberate decisions here:
 *
 * 1. **Loaded on demand.** Lenis and GSAP (~135 KB) are imported inside the
 *    effect and only once `enabled` flips true — i.e. after "Open Invitation".
 *    Nothing scrolls behind the preloader anyway, so keeping them out of the
 *    entry graph buys ~1.5s of render delay on a throttled mobile CPU.
 *
 * 2. **One RAF loop.** Lenis runs off GSAP's ticker rather than its own
 *    requestAnimationFrame, and pushes ScrollTrigger.update on every scroll.
 *    Two independent loops means the timeline scrub visibly jitters against
 *    the smoothed scroll position.
 *
 * @param enabled False while the preloader is up — the page stays locked.
 */
export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    // Respect the OS setting: native scrolling, no interpolation, no payload.
    if (prefersReduced || !enabled) return

    let lenis: Lenis | null = null
    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      // The user may have unmounted while those were in flight
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        infinite: false,
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      const tick = (time: number) => lenis?.raf(time * 1000) // GSAP is seconds, Lenis is ms
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      // Sections mounted lazily while this was loading — remeasure.
      ScrollTrigger.refresh()

      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis?.destroy()
        lenisRef.current = null
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [prefersReduced, enabled])

  // Lock the page behind the preloader. Reduced-motion users have no Lenis
  // instance at all, so the body is the only lever that works for everyone.
  useEffect(() => {
    document.body.style.overflow = enabled ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [enabled])

  return lenisRef
}

/** Smooth-scrolls to a section id, falling back to native when Lenis is off. */
export function scrollToSection(id: string, lenis?: Lenis | null) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

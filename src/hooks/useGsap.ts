import { useLayoutEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scoped GSAP context.
 *
 * Everything created inside `setup` is reverted on unmount, so ScrollTriggers
 * never leak across lazy-loaded sections — without this, scrolling back to a
 * remounted section leaves dead triggers firing against detached nodes.
 *
 * Under reduced motion nothing is created at all: the caller is expected to
 * render its resting state directly.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: { root: T }) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null)
  const prefersReduced = useReducedMotion()
  // Keep the latest setup without making it a dependency
  const setupRef = useRef(setup)
  setupRef.current = setup

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || prefersReduced) return

    const ctx = gsap.context(() => setupRef.current({ root }), root)
    // Sections mount lazily and fonts swap in late; both move elements after
    // the triggers were measured.
    ScrollTrigger.refresh()

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, ...deps])

  return ref
}

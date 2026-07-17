import { motion, useScroll, useSpring } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Scroll progress — a gold thread across the top of the viewport.
 *
 * scaleX on a transform-only element, so it never triggers layout while
 * scrolling. The spring smooths Lenis's interpolated scroll into something that
 * doesn't visibly step.
 */
export function ScrollProgress() {
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
      style={{ scaleX: prefersReduced ? scrollYProgress : scaleX }}
      aria-hidden="true"
    >
      {/* Leading glow — light travelling along the thread */}
      <span className="absolute top-0 right-0 h-full w-16 bg-gradient-to-r from-transparent to-gold/80 blur-[2px]" />
    </motion.div>
  )
}

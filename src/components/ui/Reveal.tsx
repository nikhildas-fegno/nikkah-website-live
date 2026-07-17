import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

const OFFSET = 34
const EASE_LUXE = [0.22, 1, 0.36, 1] as const

const buildVariants = (direction: RevealDirection, distance: number, delay: number): Variants => {
  const hidden: Record<string, number> = { opacity: 0 }
  switch (direction) {
    case 'up':
      hidden.y = distance
      break
    case 'down':
      hidden.y = -distance
      break
    case 'left':
      hidden.x = distance
      break
    case 'right':
      hidden.x = -distance
      break
    case 'scale':
      hidden.scale = 0.94
      break
  }
  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      /**
       * `delay` belongs HERE, not on the component's `transition` prop.
       * A variant's own transition replaces that prop wholesale, so
       * `<Reveal delay={0.3}>` was silently doing nothing — every staggered
       * reveal on the site fired at once.
       */
      transition: { duration: 0.9, ease: EASE_LUXE, delay },
    },
  }
}

interface RevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  distance?: number
  className?: string
  /** Replay each time it scrolls into view */
  repeat?: boolean
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}

/**
 * Scroll-triggered reveal. Reduced-motion users get the content immediately,
 * with no transform and no fade.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = OFFSET,
  className,
  repeat = false,
  as = 'div',
}: RevealProps) {
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as]

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={buildVariants(direction, distance, delay)}
      initial="hidden"
      whileInView="visible"
      /**
       * No negative bottom margin. `-80px` here carved a dead zone across the
       * foot of the page: anything ending within 80px of the document bottom
       * could never enter the trigger area, and — being last — could never be
       * scrolled up out of it either. The footer colophon sat at opacity 0
       * forever on phones because of exactly this.
       *
       * `amount` alone already gives the "wait until it's properly in view"
       * feel, without inventing a region the page can't reach.
       */
      viewport={{ once: !repeat, amount: 0.25 }}
    >
      {children}
    </MotionTag>
  )
}

/** Parent that staggers its children. Pair with `RevealItem`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: 'div' | 'ul' | 'section'
}) {
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as]

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  direction = 'up',
  distance = OFFSET,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  direction?: RevealDirection
  distance?: number
  as?: 'div' | 'li' | 'article'
}) {
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as]

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    /* delay 0: the parent RevealGroup's staggerChildren already spaces these
       out, and a second delay here would compound with it. */
    <MotionTag className={className} variants={buildVariants(direction, distance, 0)}>
      {children}
    </MotionTag>
  )
}

/**
 * Word-by-word text reveal for display headings. Each word is masked behind an
 * overflow-hidden box so it rises into place.
 *
 * The inter-word gap is `mr-[0.25em]` rather than a text node — whitespace
 * inside an inline-block gets trimmed, which would jam the words together.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  as: Tag = 'h2',
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
  const prefersReduced = useReducedMotion()
  const words = text.split(' ')

  if (prefersReduced) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className={`inline-block ${wordClassName ?? ''}`}
              variants={{
                hidden: { y: '115%', opacity: 0 },
                visible: {
                  y: '0%',
                  opacity: 1,
                  transition: { duration: 0.85, ease: EASE_LUXE },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

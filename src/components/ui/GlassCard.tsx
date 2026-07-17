import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { CornerFlourish } from './Ornaments'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Adds arabesque flourishes to the top-left / bottom-right corners */
  corners?: boolean
  /** Lift + gold-bloom on hover */
  interactive?: boolean
  as?: 'div' | 'article' | 'li'
}

/**
 * The frosted surface used by the event cards and the venue map.
 *
 * Hover does three things at once — a 4px lift, a warming of the gold hairline,
 * and a soft radial bloom bleeding in from the top — which together read as
 * light catching the edge of a card rather than a generic shadow change.
 */
export function GlassCard({
  children,
  className,
  corners = false,
  interactive = false,
  as = 'div',
}: GlassCardProps) {
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={cn(
        'group relative overflow-hidden rounded-[2px]',
        'glass shadow-[var(--shadow-card)]',
        interactive && 'transition-[border-color,box-shadow] duration-500',
        interactive && 'hover:border-gold/55 hover:shadow-[var(--shadow-luxe)]',
        className,
      )}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gold bloom, revealed on hover */}
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(200,169,106,0.22),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      )}

      {/* Top hairline catches the light */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
      />

      {corners && (
        <>
          <CornerFlourish
            className="pointer-events-none absolute top-2 left-2 h-9 w-9 text-gold/45"
            aria-hidden="true"
          />
          <CornerFlourish
            className="pointer-events-none absolute right-2 bottom-2 h-9 w-9 text-gold/45"
            style={{ transform: 'rotate(180deg)' }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative">{children}</div>
    </MotionTag>
  )
}

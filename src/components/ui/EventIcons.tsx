import type { ComponentType, SVGProps } from 'react'
import type { WeddingEvent } from '../../data/wedding'

/* ============================================================================
 * EVENT ICONS
 *
 * Custom line icons rather than lucide's set: each is drawn from the same
 * geometric vocabulary as the ornaments (arches, crescents, hairline strokes)
 * so the event cards read as part of the same hand. No hearts.
 * ========================================================================== */

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** A mosque arch beneath a crescent — the ceremony itself. */
function NikkahIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 27V16a8 8 0 0 1 16 0v11" />
      <path d="M12 27v-7a4 4 0 0 1 8 0v7" opacity="0.7" />
      <path d="M4 27h24" opacity="0.4" />
      <path d="M6 27V19M26 27V19" opacity="0.55" />
      <path d="M18.5 4.2A4.2 4.2 0 1 0 20 11a3.4 3.4 0 1 1-1.5-6.8z" />
      <path d="M16 8v3" opacity="0.5" />
    </svg>
  )
}

/** A covered platter — the feast. */
function WalimaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 22h24" />
      <path d="M6 22a10 10 0 0 1 20 0" />
      <path d="M16 12V9" />
      <circle cx="16" cy="7.5" r="1.5" />
      <path d="M2 25.5h28" opacity="0.4" />
      <path d="M10 22a6 6 0 0 1 12 0" opacity="0.4" />
    </svg>
  )
}

const ICONS: Record<WeddingEvent['icon'], ComponentType<IconProps>> = {
  nikkah: NikkahIcon,
  walima: WalimaIcon,
}

export function EventIcon({ name, ...props }: { name: WeddingEvent['icon'] } & IconProps) {
  const Icon = ICONS[name]
  return <Icon {...props} />
}

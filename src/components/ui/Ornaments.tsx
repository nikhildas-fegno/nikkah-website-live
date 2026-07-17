import type { SVGProps } from 'react'
import { cn } from '../../utils/cn'

/* ============================================================================
 * ORNAMENT LIBRARY
 *
 * The entire decorative language of the site. All geometry is constructed
 * rather than drawn by hand, following classical Islamic construction:
 * an 8-fold rosette (khatim) from two overlaid squares, girih strapwork from a
 * repeating unit cell, and arabesque scrollwork from mirrored béziers.
 *
 * Everything is stroke-based so it inherits `currentColor` and scales cleanly.
 * ========================================================================== */

/* -- geometry helpers ------------------------------------------------------ */

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

/** Star polygon points, alternating outer/inner radius. */
export function starPoints(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
): string {
  const step = 360 / (points * 2)
  const coords: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const [x, y] = polar(cx, cy, i % 2 === 0 ? outer : inner, i * step)
    coords.push(`${x.toFixed(3)},${y.toFixed(3)}`)
  }
  return coords.join(' ')
}

/* -- Khatim: the signature 8-point seal ------------------------------------ */

interface KhatimProps extends SVGProps<SVGSVGElement> {
  /** Draw the enclosing rings */
  rings?: boolean
  strokeWidth?: number
}

/**
 * Khatim Sulaymani — the 8-fold seal. This is the site's signature mark:
 * it draws itself in the preloader, then recurs as section markers and
 * divider centres.
 */
export function Khatim({ rings = true, strokeWidth = 1, className, ...props }: KhatimProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
        {/* Two squares at 45° — the classical construction of the 8-point star */}
        <rect x="21.5" y="21.5" width="57" height="57" />
        <rect x="21.5" y="21.5" width="57" height="57" transform="rotate(45 50 50)" />
        {/* Interior rosette */}
        <polygon points={starPoints(50, 50, 30, 12.4, 8)} opacity="0.55" />
        <polygon points={starPoints(50, 50, 15, 6.2, 8)} opacity="0.35" />
        {rings && (
          <>
            <circle cx="50" cy="50" r="40.5" opacity="0.5" />
            <circle cx="50" cy="50" r="45" opacity="0.25" />
          </>
        )}
      </g>
    </svg>
  )
}

/* -- Eight-point star (solid-friendly, used small) -------------------------- */

export function StarEight({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <polygon
        points={starPoints(12, 12, 11, 4.55, 8)}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Filled diamond — the smallest unit of punctuation in the type system. */
export function Lozenge({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={className} {...props}>
      <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="currentColor" />
    </svg>
  )
}

/* -- Dividers -------------------------------------------------------------- */

interface DividerProps {
  className?: string
  /** 'star' centres a khatim; 'lozenge' is quieter; 'plain' is a bare rule */
  variant?: 'star' | 'lozenge' | 'plain'
  width?: string
}

/**
 * The recurring section divider: a hairline that fades outward from a centred
 * ornament. Replaces every heart icon a wedding template would reach for.
 */
export function Divider({ className, variant = 'star', width = '100%' }: DividerProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-4 text-gold', className)}
      style={{ width }}
      role="presentation"
    >
      <span className="rule-fade h-px flex-1" />
      {variant === 'star' && (
        <span className="relative flex shrink-0 items-center justify-center">
          <StarEight className="h-4 w-4 opacity-90" />
          <span className="absolute inset-0 -z-10 rounded-full bg-gold/10 blur-md" />
        </span>
      )}
      {variant === 'lozenge' && (
        <span className="flex shrink-0 items-center gap-1.5">
          <Lozenge className="h-1 w-1 opacity-50" />
          <Lozenge className="h-1.5 w-1.5" />
          <Lozenge className="h-1 w-1 opacity-50" />
        </span>
      )}
      <span className="rule-fade h-px flex-1" />
    </div>
  )
}

/** Ornate divider with flanking arabesque scrolls — used between Bride & Groom. */
export function ArabesqueDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full items-center justify-center text-gold', className)}>
      <svg
        viewBox="0 0 400 40"
        fill="none"
        className="h-8 w-full max-w-md"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none">
          {/* Mirrored scrollwork either side of the seal */}
          <path d="M20 20 H120" opacity="0.35" />
          <path d="M120 20 C140 20 140 8 156 8 C170 8 172 20 158 20 C146 20 144 32 158 32 C172 32 176 20 186 20" />
          <path d="M280 20 H380" opacity="0.35" />
          <path d="M280 20 C260 20 260 8 244 8 C230 8 228 20 242 20 C254 20 256 32 242 32 C228 32 224 20 214 20" />
          <circle cx="200" cy="20" r="13" opacity="0.6" />
          <polygon points={starPoints(200, 20, 9, 3.7, 8)} strokeLinejoin="round" />
          <circle cx="120" cy="20" r="2" fill="currentColor" stroke="none" />
          <circle cx="280" cy="20" r="2" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </div>
  )
}

/* -- Corner arabesque ------------------------------------------------------ */

/**
 * A single corner flourish. Rotate with `style={{transform}}` at the call site
 * to build a full frame from four instances.
 */
export function CornerFlourish({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className} {...props}>
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M0 0 H44" opacity="0.55" />
        <path d="M0 0 V44" opacity="0.55" />
        <path d="M0 10 H30 Q34 10 34 14 V34" opacity="0.35" />
        {/* Scrolling vine, curling inward */}
        <path d="M44 4 C64 4 78 18 78 38 C78 52 68 62 54 62 C44 62 38 55 38 46 C38 39 43 34 50 34 C56 34 60 38 60 44" />
        <path d="M4 44 C4 64 18 78 38 78 C52 78 62 68 62 54" opacity="0.5" />
        <circle cx="60" cy="44" r="2.2" fill="currentColor" stroke="none" />
        <path d="M12 12 L26 26" opacity="0.3" />
      </g>
    </svg>
  )
}

/** Four flourishes, one per corner — the Hero's decorative frame. */
export function OrnateFrame({ className, inset = 'inset-4' }: { className?: string; inset?: string }) {
  const corners = [
    { rotate: 0, pos: 'top-0 left-0' },
    { rotate: 90, pos: 'top-0 right-0' },
    { rotate: 180, pos: 'bottom-0 right-0' },
    { rotate: 270, pos: 'bottom-0 left-0' },
  ]
  return (
    <div className={cn('pointer-events-none absolute', inset, className)} aria-hidden="true">
      <div className="relative h-full w-full">
        {/* Hairline border */}
        <div className="absolute inset-0 border border-current opacity-25" />
        {corners.map((c) => (
          <CornerFlourish
            key={c.rotate}
            className={cn('absolute h-14 w-14 md:h-20 md:w-20', c.pos)}
            style={{ transform: `rotate(${c.rotate}deg)` }}
          />
        ))}
      </div>
    </div>
  )
}

/* -- Girih strapwork pattern (tiling background) --------------------------- */

/**
 * Seamless girih tile as an SVG <pattern>. Each instance needs a unique id or
 * the defs collide across mounts — hence the required `id` prop.
 */
export function GirihPattern({
  id,
  className,
  scale = 60,
  opacity = 0.5,
}: {
  id: string
  className?: string
  scale?: number
  opacity?: number
}) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width={scale} height={scale} patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="0.6" fill="none" opacity={opacity}>
            {/* Unit cell: an 8-star with strapwork reaching each edge midpoint */}
            <polygon
              points={starPoints(scale / 2, scale / 2, scale * 0.3, scale * 0.124, 8)}
              strokeLinejoin="round"
            />
            <rect x={scale * 0.15} y={scale * 0.15} width={scale * 0.7} height={scale * 0.7} />
            <rect
              x={scale * 0.15}
              y={scale * 0.15}
              width={scale * 0.7}
              height={scale * 0.7}
              transform={`rotate(45 ${scale / 2} ${scale / 2})`}
              opacity="0.5"
            />
            {/* Edge connectors — these make the tile read as continuous */}
            <path d={`M0 0 L${scale * 0.15} ${scale * 0.15}`} />
            <path d={`M${scale} 0 L${scale * 0.85} ${scale * 0.15}`} />
            <path d={`M0 ${scale} L${scale * 0.15} ${scale * 0.85}`} />
            <path d={`M${scale} ${scale} L${scale * 0.85} ${scale * 0.85}`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* -- Moroccan quatrefoil lattice ------------------------------------------- */

export function LatticePattern({
  id,
  className,
  scale = 48,
  opacity = 0.45,
}: {
  id: string
  className?: string
  scale?: number
  opacity?: number
}) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width={scale} height={scale} patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="0.7" fill="none" opacity={opacity}>
            {/* Interlocking arcs → quatrefoil lattice */}
            <path
              d={`M${scale / 2} 0 Q${scale} 0 ${scale} ${scale / 2} Q${scale} ${scale} ${scale / 2} ${scale} Q0 ${scale} 0 ${scale / 2} Q0 0 ${scale / 2} 0 Z`}
            />
            <circle cx={scale / 2} cy={scale / 2} r={scale * 0.13} opacity="0.7" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* -- Arch (mihrab silhouette) ---------------------------------------------- */

/**
 * Pointed Islamic arch used to frame the couple portraits. Returned as a path
 * string so it can serve double duty as a clip-path.
 */
export function archPath(w: number, h: number): string {
  const shoulder = h * 0.52
  return [
    `M0 ${h}`,
    `L0 ${shoulder}`,
    `Q0 ${h * 0.16} ${w / 2} 0`,
    `Q${w} ${h * 0.16} ${w} ${shoulder}`,
    `L${w} ${h}`,
    'Z',
  ].join(' ')
}

export function ArchFrame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={archPath(200, 280)}
        stroke="currentColor"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* -- Crescent + star (small, restrained) ----------------------------------- */

export function Crescent({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M17.5 3.2A9.4 9.4 0 1 0 20.8 15 7.6 7.6 0 1 1 17.5 3.2Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

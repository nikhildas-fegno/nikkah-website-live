import { useState, type CSSProperties } from 'react'
import { cn } from '../../utils/cn'
import { GirihPattern, Khatim } from './Ornaments'

/** An alternative source, chosen by media query and/or format support. */
export interface ImageSource {
  /** e.g. '(max-width: 767px)'. Omit to offer the source at every width —
   *  which is how plain format negotiation (WebP → JPEG) works. */
  media?: string
  srcSet: string
  type?: string
}

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  /** Applied to the outer box — e.g. an aspect-ratio that comes from data
   *  rather than from a Tailwind class the scanner would have to find. */
  style?: CSSProperties
  imgClassName?: string
  /**
   * Art direction. Rendered as <source> elements inside a <picture>, so the
   * browser picks ONE before any request goes out — no JS, no double download,
   * and it's decided before React has even hydrated.
   */
  sources?: ImageSource[]
  /** Label drawn on the fallback panel, e.g. the person's initial */
  fallbackLabel?: string
  /** Developer nudge naming the missing file. Dev builds only — never shipped. */
  fallbackHint?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Non-decorative sizing hint for the browser */
  sizes?: string
  onLoad?: () => void
}

/**
 * Image with a designed fallback.
 *
 * A missing or failed source resolves to a girih-patterned ivory panel with a
 * khatim seal rather than a broken icon or a grey box — which reads as
 * intentional. Drop the real file at the same path and it takes over with no
 * code change.
 *
 * Pass `sources` for art direction (e.g. a portrait crop on phones).
 */
export function SmartImage({
  src,
  alt,
  className,
  style,
  imgClassName,
  sources,
  fallbackLabel,
  fallbackHint,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
  onLoad,
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  return (
    <div className={cn('relative overflow-hidden bg-ivory', className)} style={style}>
      {status !== 'error' && (
        <picture>
          {/* Keyed on srcSet: media is optional now, and every source points at
              a distinct file anyway. */}
          {sources?.map((s) => (
            <source key={s.srcSet} media={s.media} srcSet={s.srcSet} type={s.type} />
          ))}
          <img
            src={src}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority}
            sizes={sizes}
            decoding="async"
            onLoad={() => {
              setStatus('ready')
              onLoad?.()
            }}
            onError={() => setStatus('error')}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-1000',
              status === 'ready' ? 'opacity-100' : 'opacity-0',
              imgClassName,
            )}
          />
        </picture>
      )}

      {status === 'error' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-ivory via-bg to-[#F1EBDF]"
          role="img"
          aria-label={alt}
        >
          <GirihPattern
            id={`fallback-${src.replace(/\W/g, '')}`}
            className="absolute inset-0 text-gold/25"
            scale={44}
          />
          <div className="relative flex flex-col items-center gap-3">
            <Khatim className="h-16 w-16 text-gold/60" strokeWidth={0.9} />
            {fallbackLabel && (
              <span className="display foil text-5xl leading-none">{fallbackLabel}</span>
            )}
            {/* Dev-only: guests must never be shown our TODO list */}
            {fallbackHint && import.meta.env.DEV && (
              <span className="eyebrow text-[0.5rem] text-muted/70">{fallbackHint}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

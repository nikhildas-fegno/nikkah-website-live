import { cn } from '../../utils/cn'
import { Divider } from './Ornaments'
import { Reveal, TextReveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  /** Arabic rendering shown above the title, right-to-left */
  arabic?: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
  divider?: boolean
}

/**
 * Shared section header: micro-label, optional Arabic line, display title with
 * a word-by-word reveal, then a divider. Used by every section so the vertical
 * rhythm stays identical throughout.
 */
export function SectionHeading({
  eyebrow,
  title,
  arabic,
  subtitle,
  align = 'center',
  className,
  divider = true,
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="fade">
          <div className="flex items-center gap-3">
            {centered && <span className="h-px w-6 bg-gold/50" />}
            <span className="eyebrow">{eyebrow}</span>
            {centered && <span className="h-px w-6 bg-gold/50" />}
          </div>
        </Reveal>
      )}

      {arabic && (
        <Reveal direction="fade" delay={0.08}>
          <p className="arabic text-2xl text-emerald/75 md:text-3xl" lang="ar">
            {arabic}
          </p>
        </Reveal>
      )}

      <TextReveal
        text={title}
        as="h2"
        className={cn(
          'display text-ink',
          'text-[clamp(2.4rem,6.5vw,4.5rem)]',
          centered ? 'text-center' : 'text-left',
        )}
      />

      {subtitle && (
        <Reveal direction="up" delay={0.15}>
          <p
            className={cn(
              'max-w-xl text-[0.9rem] leading-relaxed font-light text-balance text-muted',
              centered && 'mx-auto',
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}

      {divider && (
        <Reveal direction="scale" delay={0.2} className={cn('w-full', centered && 'max-w-xs')}>
          <Divider variant="star" />
        </Reveal>
      )}
    </header>
  )
}

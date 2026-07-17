import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { bride, groom, wedding } from '../../data/wedding'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GirihPattern, OrnateFrame, StarEight } from '../ui/Ornaments'
import { Particles } from '../FloatingPatterns/Particles'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The geometry dissolves where the type is.
 *
 * A mask, not a dimmer. Lowering the pattern's opacity everywhere would kill
 * the texture at the edges (the whole point of it) while STILL leaving stray
 * strokes crossing the letterforms — the readability problem isn't contrast,
 * it's line-noise running through the words. So the pattern is simply absent
 * across the centre and reaches full strength out at the margins, which also
 * makes the geometry read as a frame around the names rather than a rug under
 * them.
 *
 * Alpha is the mask: transparent hides, black shows.
 */
const GEOMETRY_MASK =
  'radial-gradient(ellipse 62% 54% at 50% 46%, transparent 32%, rgba(0,0,0,0.28) 58%, rgba(0,0,0,0.75) 78%, black 92%)'

/** A pool of light for the names to sit in, so they lift off the field. */
const POOL =
  'radial-gradient(ellipse 58% 50% at 50% 46%, rgba(200,169,106,0.16) 0%, rgba(200,169,106,0.07) 45%, transparent 72%)'

/** Emerald deepens toward the edges, holding the eye in the centre. */
const VIGNETTE = 'radial-gradient(ellipse at center, transparent 40%, rgba(8,56,48,0.85) 100%)'

interface HeroProps {
  /** Held false until the preloader hands over, so the entrance plays on cue */
  active: boolean
  onScrollCue: () => void
}

/**
 * Fullscreen hero — typography on an emerald field.
 *
 * The house photograph deliberately does NOT live here. A hero forces a
 * landscape photo into whatever aspect the viewport happens to be, which
 * cropped it badly on phones and buried it under the grade needed to keep type
 * legible on desktop. It now sits in the Invitation section, framed at its own
 * aspect and undimmed, beside the address of the very house it shows.
 *
 * What's left is the invitation's cover: the names, very large, on constructed
 * geometry. Depth comes from three planes moving at different rates — the
 * masked weave, the ornamental frame, and the type — rather than a photograph.
 *
 * No negative z-indexes: these planes are positioned siblings painting in DOM
 * order above the section's own background, which sidesteps the stacking-context
 * trap where a section's background paints over its own negative-z children.
 */
export function Hero({ active, onScrollCue }: HeroProps) {
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // The type drifts up and fades; the geometry behind it drifts slower
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', prefersReduced ? '0%' : '-16%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, prefersReduced ? 1 : 0])
  const fieldY = useTransform(scrollYProgress, [0, 1], ['0%', prefersReduced ? '0%' : '8%'])

  // Everything after the doors open cascades from this baseline
  const show = active ? 'visible' : 'hidden'
  const rise = {
    hidden: { opacity: 0, y: 34 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-[100svh] min-h-[36rem] items-center justify-center overflow-hidden bg-emerald-deep"
      aria-label="Nikah invitation"
    >
      {/* ---- Plane 1: girih weave, masked away from the type --------------- */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: fieldY,
          maskImage: GEOMETRY_MASK,
          WebkitMaskImage: GEOMETRY_MASK,
        }}
        aria-hidden="true"
      >
        <GirihPattern id="hero-girih" className="absolute inset-0 text-gold/[0.16]" scale={82} />
      </motion.div>

      {/* ---- Plane 2: light ------------------------------------------------ */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: POOL }} />
        <div className="absolute inset-0" style={{ background: VIGNETTE }} />
      </div>

      {/* Motes keep clear of the centre for the same reason the weave does */}
      <Particles count={14} tone="gold" className="opacity-60" />

      {/* ---- Plane 3: ornamental frame ------------------------------------- */}
      <motion.div
        className="absolute inset-0 text-gold/60"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
      >
        <OrnateFrame inset="inset-4 md:inset-8" />
      </motion.div>

      {/* ---- Plane 4: content ---------------------------------------------- */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial="hidden"
          animate={show}
          variants={{ visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } } }}
          className="flex max-w-2xl flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div
            variants={rise}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-8 flex items-center gap-4"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="font-body text-[0.6rem] font-light tracking-[0.42em] text-gold uppercase md:text-[0.68rem]">
              Nikah Invitation
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
          </motion.div>

          {/* Names — the loudest moment on the page. The shadow is a soft pool
              of emerald, not a drop shadow: it separates the letterforms from
              whatever texture survives behind them without ever looking like
              an effect. */}
          <motion.h1
            variants={rise}
            transition={{ duration: 1.1, ease: EASE }}
            className="display flex flex-col items-center leading-[0.9] text-ivory"
            style={{ textShadow: '0 0 60px rgba(8,56,48,0.55), 0 2px 18px rgba(8,56,48,0.35)' }}
          >
            <span className="text-[clamp(3.4rem,13vw,9rem)]">{groom.firstName}</span>

            {/* Ampersand, flanked by rules */}
            <motion.span
              variants={rise}
              transition={{ duration: 0.9, ease: EASE }}
              className="my-3 flex items-center gap-6 md:my-4"
            >
              <span className="foil animate-foil text-[clamp(1.75rem,4.5vw,3rem)] italic">&amp;</span>
            </motion.span>

            <span className="text-[clamp(3.4rem,13vw,9rem)]">{bride.firstName}</span>
          </motion.h1>

          {/* Date */}
          <motion.div
            variants={rise}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-10 flex items-center gap-4"
          >
            <StarEight className="h-3 w-3 text-gold/70" />
            <p className="font-body text-[0.62rem] font-light tracking-[0.32em] text-ivory/90 uppercase md:text-[0.72rem]">
              {wedding.dayLabel} &nbsp;·&nbsp; {wedding.dateLabel}
            </p>
            <StarEight className="h-3 w-3 text-gold/70" />
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            variants={rise}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-9 max-w-lg"
          >
            <p
              className="display text-[clamp(1rem,2.4vw,1.3rem)] leading-relaxed text-balance text-ivory/70 italic"
              style={{ textShadow: '0 0 40px rgba(8,56,48,0.5)' }}
            >
              “{wedding.quote.text}”
            </p>
            <cite className="mt-4 block font-body text-[0.55rem] font-light tracking-[0.3em] text-gold/75 not-italic uppercase">
              {wedding.quote.source}
            </cite>
          </motion.blockquote>
        </motion.div>
      </motion.div>

      {/* ---- Scroll cue ----------------------------------------------------- */}
      <motion.button
        onClick={onScrollCue}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.6 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/55 transition-colors hover:text-gold"
        aria-label="Scroll to the invitation"
      >
        <span className="font-body text-[0.5rem] font-light tracking-[0.32em] uppercase">
          Scroll
        </span>
        <motion.span
          animate={prefersReduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1} />
        </motion.span>
      </motion.button>
    </section>
  )
}

// bride/groom are no longer read here — the signature block below is commented
// out. Restore the import if you bring it back.
import { wedding, hosts } from '../../data/wedding'
import { ArabesqueDivider, Divider, GirihPattern, Khatim } from '../ui/Ornaments'
import { Reveal, TextReveal } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'

/**
 * Format negotiation, not art direction — one square photo serves every device,
 * so the only choice here is WebP (195 KB) versus the JPEG fallback (267 KB).
 * The browser takes the first source it understands.
 */
const HOUSE_SOURCES = [{ srcSet: wedding.heroImageWebp, type: 'image/webp' }]

/**
 * The Bismillah card — the site's quiet centre.
 *
 * Deliberately the least decorated section on the page. It follows the Hero's
 * cinematic noise with near-silence: one seal, one line of Arabic, and a great
 * deal of paper. The restraint is the point.
 */
export function Invitation() {
  return (
    <section id="invitation" className="section-y relative overflow-hidden" aria-label="Invitation">
      {/* Barely-there girih wash */}
      <GirihPattern
        id="invitation-girih"
        className="pointer-events-none absolute inset-0 text-gold/[0.055]"
        scale={90}
      />

      <div className="shell-narrow relative">
        <div className="grain relative mx-auto flex flex-col items-center px-6 py-6 text-center md:px-16 md:py-20">
          {/* Hairline frame with notched corners */}
          <div
            className="pointer-events-none absolute inset-0 border border-gold/25"
            aria-hidden="true"
          />
          {(
            [
              'top-0 left-0 border-t-2 border-l-2',
              'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2',
              'bottom-0 right-0 border-b-2 border-r-2',
            ] as const
          ).map((pos) => (
            <span
              key={pos}
              className={`pointer-events-none absolute h-5 w-5 border-gold/70 ${pos}`}
              aria-hidden="true"
            />
          ))}

          {/* Seal */}
          <Reveal direction="scale">
            <div className="relative mb-9 flex items-center justify-center">
              <Khatim
                className="animate-spin-slow h-16 w-16 text-gold/70 md:h-20 md:w-20"
                strokeWidth={0.8}
              />
              <span className="absolute inset-0 -z-10 rounded-full bg-gold/10 blur-xl" />
            </div>
          </Reveal>

          {/* Bismillah — the largest Arabic on the page */}
          <Reveal direction="up" delay={0.1}>
            <p
              className="arabic text-[clamp(1.6rem,5vw,2.6rem)] leading-relaxed text-emerald"
              lang="ar"
            >
              {wedding.bismillah.arabic}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <p className="mt-4 max-w-md text-[0.68rem] leading-relaxed font-light tracking-[0.12em] text-balance text-muted">
              {wedding.bismillah.translation}
            </p>
          </Reveal>

          <Reveal direction="scale" delay={0.3} className="my-10 w-full">
            <ArabesqueDivider />
          </Reveal>

          {/* The ask */}
          <TextReveal
            text={wedding.invitationMessage}
            as="p"
            className="display max-w-2xl text-[clamp(1.5rem,3.8vw,2.4rem)] leading-[1.35] text-balance text-ink"
            stagger={0.045}
          />

          <Reveal direction="up" delay={0.25}>
            <p className="mt-8 max-w-lg text-[0.82rem] leading-loose font-light text-pretty text-muted">
              {wedding.invitationSubtext}
            </p>
          </Reveal>

          {/* Hosts — the invitation is extended by the groom's grandparents */}
          <Reveal direction="up" delay={0.3}>
            <div className="mt-12 flex flex-col items-center gap-4">
              <Divider variant="lozenge" className="mb-2 w-40" />

              <p className="eyebrow text-[0.5rem]">With the blessings of</p>

              <p className="display text-xl leading-relaxed text-ink md:text-2xl">
                {hosts.grandfather}
                <span className="mx-2 text-gold">&amp;</span>
                {hosts.grandmother}
              </p>
            </div>
          </Reveal>

          {/*
            The house the invitation is extended from — placed here rather than
            in the Hero, where a fullscreen crop mangled it. The address it
            belongs to is its caption, directly below.

            The frame is pinned to the photo's own ratio (wedding.heroImageAspect),
            so it renders at native aspect and is never cropped, on any device.
            That's what lets one file serve them all — and it means a re-crop of
            the photo needs that value updated to match.
          */}
          <Reveal direction="scale" delay={0.1} className="mt-10 w-full">
            <figure className="relative mx-auto max-w-2xl">
              {/* Offset gold rule — the frame lifts off the photo */}
              <div
                aria-hidden="true"
              />

              <div className="relative overflow-hidden">
                <SmartImage
                  src={wedding.heroImage}
                  sources={HOUSE_SOURCES}
                  alt={wedding.heroImageAlt}
                  className="w-full"
                  style={{ aspectRatio: wedding.heroImageAspect }}
                />
                {/* Barely-there warm grade, so the photo belongs to the palette
                    without being dimmed the way the Hero had to dim it */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gold/[0.05] mix-blend-overlay"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 border border-gold/25"
                  aria-hidden="true"
                />
              </div>

            </figure>
          </Reveal>

          {/* Signature */}
          {/* <Reveal direction="fade" delay={0.35}>
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-px bg-gradient-to-b from-transparent to-gold/60" />
              <p className="display text-2xl text-ink italic md:text-3xl">
                {groom.firstName} <span className="text-gold">&amp;</span> {bride.firstName}
              </p>
              <p className="eyebrow text-[0.5rem]">{wedding.dateLabel}</p>
            </div>
          </Reveal> */}
        </div>
      </div>
    </section>
  )
}

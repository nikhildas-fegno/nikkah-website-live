import { gsap } from 'gsap'
import { sharingOurJoy } from '../../data/wedding'
import { useGsapContext } from '../../hooks/useGsap'
import { SectionHeading } from '../ui/SectionHeading'
import { Divider, GirihPattern, Lozenge, StarEight } from '../ui/Ornaments'

/**
 * "Sharing Our Joy" — the family standing with the couple.
 *
 * A staple of Malayali Muslim invitations, and here it's the one place GSAP
 * ScrollTrigger genuinely beats Framer Motion: a single timeline staggers every
 * name off one trigger, rather than each row paying for its own
 * IntersectionObserver and its own React re-render. It's also why the
 * Lenis↔ScrollTrigger wiring in useLenis exists.
 *
 * Set as a centred roll of names — deliberately not a grid of cards. These are
 * people, not features.
 */
export function SharingJoy() {
  const rootRef = useGsapContext<HTMLDivElement>(({ root }) => {
    gsap.from(root.querySelectorAll('[data-joy-name]'), {
      autoAlpha: 0,
      y: 24,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.09, // names arrive in sequence, like a list being read aloud
      scrollTrigger: {
        trigger: root,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    })
  })

  return (
    <section
      id="sharing-joy"
      className="section-y relative overflow-hidden bg-ivory"
      aria-label="Sharing Our Joy"
    >
      <GirihPattern
        id="joy-girih"
        className="pointer-events-none absolute inset-0 text-gold/[0.05]"
        scale={92}
      />
      {/* Edge fades so the ivory band never terminates on a hard line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg to-transparent" />

      <div className="shell-narrow relative">
        <SectionHeading
          eyebrow="With gratitude"
          arabic="مشاركة فرحتنا"
          title={sharingOurJoy.title}
          subtitle={sharingOurJoy.subtitle}
          className="mb-14"
        />

        <div ref={rootRef} className="flex flex-col items-center">
          <ul className="flex w-full max-w-xl flex-col items-center">
            {sharingOurJoy.names.map((name, i) => (
              <li key={name} data-joy-name className="group flex w-full flex-col items-center">
                <span className="display text-center text-[clamp(1.35rem,3.2vw,1.85rem)] leading-snug text-ink transition-colors duration-500 group-hover:text-emerald">
                  {name}
                </span>

                {/* Hairline between names, never after the last */}
                {i < sharingOurJoy.names.length - 1 && (
                  <span
                    className="my-5 flex items-center gap-3 text-gold/60"
                    aria-hidden="true"
                  >
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
                    <Lozenge className="h-1 w-1" />
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
                  </span>
                )}
              </li>
            ))}
          </ul>

          <Divider variant="star" className="mt-12 max-w-xs" />

          <p className="mt-8 flex items-center gap-3 text-[0.72rem] font-light tracking-[0.08em] text-muted">
            <StarEight className="h-3 w-3 text-gold/60" aria-hidden="true" />
            <span>and all our beloved family and friends</span>
            <StarEight className="h-3 w-3 text-gold/60" aria-hidden="true" />
          </p>
        </div>
      </div>
    </section>
  )
}

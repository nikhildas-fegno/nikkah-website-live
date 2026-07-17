import { LatticePattern } from '../ui/Ornaments'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { CoupleNames, CoupleSlider } from './CoupleSlider'

/**
 * The Couple — one showcase, not two halves.
 *
 * This used to be a two-column grid with the bride and groom either side of a
 * vertical divider, which set them apart on the one page meant to join them.
 * Now a slider of photos of the two of them sits above a single block carrying
 * both names and both families.
 */
export function Couple() {
  return (
    <section
      id="couple"
      className="section-y relative overflow-hidden bg-ivory"
      aria-label="The Couple"
    >
      <LatticePattern
        id="couple-lattice"
        className="pointer-events-none absolute inset-0 text-gold/[0.06]"
        scale={52}
      />
      {/* Edge fades so the pattern never terminates on a hard line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Bismillah — the two families"
          arabic="العروسان"
          title="The Couple"
          subtitle="Two families, one intention — brought together by the mercy of Allah."
          className="mb-14 md:mb-20"
        />

        {/* Names first: they introduce the couple, and the photos below then
            show who's just been named. */}
        <Reveal direction="up">
          <CoupleNames />
        </Reveal>

        {/* <Reveal direction="up" delay={0.12} className="mt-14 md:mt-16">
          <CoupleSlider />
        </Reveal> */}
      </div>
    </section>
  )
}

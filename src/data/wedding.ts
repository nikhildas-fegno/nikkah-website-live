/* ============================================================================
 * WEDDING DATA — the single source of truth for the whole invitation.
 *
 *  ▸ Every user-facing string, date, name and link lives here.
 *  ▸ No component hardcodes content. Edit this file only.
 *  ▸ Fields marked  // VERIFY:  are derived or assumed — please confirm them.
 *
 *  The one exception is the boot shell in index.html (the couple's initials),
 *  which must paint before JavaScript loads. See README.
 * ========================================================================== */

export interface Person {
  /** Given name shown large in the Hero */
  firstName: string
  /** Full formal name shown in the Couple section */
  fullName: string
  /** Arabic rendering — optional, omit to hide */
  arabicName?: string
  father: string
  mother: string
  /** Path under /public. Drop the real photo at this exact path. */
  image: string
  /** Single initial used by the preloader monogram */
  initial: string
}

export interface WeddingEvent {
  id: string
  name: string
  arabicName?: string
  /** ISO 8601 with offset. Null when the timing isn't fixed yet — the card
   *  then shows the venue alone and the countdown ignores it. */
  dateTime: string | null
  /** Human-readable time, e.g. "5:00 PM". Empty string hides the row. */
  timeLabel: string
  venue: string
  address: string
  description: string
  icon: 'nikah' | 'walima'
  mapsUrl: string
}

export interface SocialLink {
  label: string
  href: string
  icon: 'instagram' | 'facebook' | 'mail' | 'phone'
}

/* -------------------------------------------------------------------------- */
/*  COUPLE                                                                     */
/* -------------------------------------------------------------------------- */

// VERIFY: `arabicName` should mirror `fullName` in full, not just the given
// name. These are the standard Arabic renderings — نشاد محمد and لبنى محمود —
// but names admit more than one spelling, so please have the families confirm
// them before this goes out.
export const groom: Person = {
  firstName: 'Nishad',
  fullName: 'Nishad Muhammed',
  arabicName: 'نيشاد محمد',
  father: 'Late Noushad KT',
  mother: 'Shakeera K',
  image: '/images/groom.jpg',
  initial: 'N',
}

export const bride: Person = {
  firstName: "Lubna",
  fullName: "Lubna Mahamood",
  arabicName: "لبنى بنت محمود",
  father: "Mahamood CV",
  mother: "Ramlath Mahamood",
  image: "/images/bride.jpg",
  initial: "L",
};

/* -------------------------------------------------------------------------- */
/*  COUPLE PHOTOS — the slider in the Couple section                           */
/* -------------------------------------------------------------------------- */

export interface CouplePhoto {
  /** Path under /public */
  src: string
  /** Optional line under the photo — a place, a moment. Omit to show none. */
  caption?: string
}

/**
 * Photos of Nishad and Lubna TOGETHER.
 *
 * Add, remove or reorder freely — the slider, the dots and the counter all
 * follow this list. Drop the files at these exact paths (or change the paths to
 * match your filenames). Any that are missing show a gold-seal panel rather
 * than a broken image, so the section never looks broken while you gather them.
 */
export const couplePhotos: CouplePhoto[] = [
  { src: '/images/couple-1.jpg' },
  { src: '/images/couple-2.jpg' },
  { src: '/images/couple-3.jpg' },
]

/**
 * The frame the photos sit in, as a raw CSS aspect-ratio (applied inline —
 * Tailwind's scanner doesn't pick arbitrary classes out of this data file).
 *
 * They're clipped to a mihrab arch, so a PORTRAIT ratio suits them best. If
 * your photos are landscape, set this to '4 / 3' or '3 / 2' — otherwise cover
 * will crop the sides to fill a tall frame.
 */
export const couplePhotoAspect = '5 / 6'

/* -------------------------------------------------------------------------- */
/*  HOSTS — the invitation is extended by the groom's grandparents             */
/* -------------------------------------------------------------------------- */

export const hosts = {
  grandfather: 'Mr. Hamsa P.P.',
  grandmother: 'Mrs. Safiya Kodiyil',
  /** Rendered line by line, so keep it as separate lines */
  address: ["Shahina's", 'Near Royal School', 'Syed Nagar', 'Taliparamba'],
} as const

/** The bride's family home. */
export const brideHome = {
  address: ['Raheela Mahal', 'Master Road', 'Pushpagiri', 'Thaliparamba'],
} as const

/* -------------------------------------------------------------------------- */
/*  THE OCCASION                                                               */
/* -------------------------------------------------------------------------- */

export const wedding = {
  /** Primary date — the countdown target. ISO 8601, IST (+05:30). */
  date: '2026-08-07T17:00:00+05:30',
  /** Pre-formatted so the Hero never waits on a date library */
  dateLabel: '7 August 2026',
  dayLabel: 'Friday',
  // VERIFY: Umm al-Qura reckoning. Local moon sighting may differ by a day.
  hijriLabel: '24 Safar 1448',
  /**
   * The family home — one photo, every device. Shown in the Invitation section
   * (not the Hero: a fullscreen crop mangled it on phones).
   *
   * The frame is pinned to `heroImageAspect`, so the photo renders at its own
   * native ratio and is never cropped on any screen. **If you re-crop the file,
   * update that ratio to match** or the frame will quietly start cutting the
   * edges off the very crop you just made.
   */
  heroImage: '/images/hero-house.jpg', // 1254×722 — also the OG share image
  /** WebP is 136 KB vs the JPEG's 227 KB. Non-WebP browsers fall back. */
  heroImageWebp: '/images/hero-house.webp',
  /**
   * Raw CSS aspect-ratio, applied inline — deliberately NOT a Tailwind class.
   * An `aspect-[1254/722]` string here silently fails: Tailwind's scanner
   * doesn't pick arbitrary utilities out of this data file, so no rule is
   * emitted and the frame collapses to zero height.
   */
  heroImageAspect: '1254 / 722',
  heroImageAlt: 'The family home in Taliparamba',
  quote: {
    text: 'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.',
    source: 'Surah Ar-Rum, 30:21',
  },
  bismillah: {
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    translation: 'In the Name of Allah, the Most Compassionate, the Most Merciful',
  },
  invitationMessage:
    'Together with our families, we request the honour of your presence at our Nikah ceremony.',
  invitationSubtext:
    'With hearts full of gratitude to Allah, we invite you to share in the joy of this blessed union — and to remember us in your prayers.',
} as const

/* -------------------------------------------------------------------------- */
/*  VENUE & MAPS                                                               */
/* -------------------------------------------------------------------------- */

export const venue = {
  name: 'Taliparamba Masjid',
  address: 'Taliparamba, Kannur, Kerala',
  /**
   * VERIFY: no maps link was supplied, so these are *name searches*, not an
   * exact pin — Google may land guests on the wrong mosque.
   *
   * To fix: open Google Maps → find the exact building → Share → Copy link,
   * and paste it into `mapsUrl`. For `embedUrl`, replace the `q=` value with
   * the coordinates, e.g. `q=12.0417,75.3608`.
   */
  mapsUrl: 'https://maps.google.com/?q=Taliparamba+Juma+Masjid+Kannur+Kerala',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Taliparamba+Juma+Masjid+Kannur+Kerala',
  /** Keyless embed — `output=embed` needs no API key and no billing account. */
  embedUrl:
    'https://maps.google.com/maps?q=Taliparamba+Juma+Masjid+Kannur+Kerala&z=15&output=embed',
} as const

/* -------------------------------------------------------------------------- */
/*  EVENTS                                                                     */
/* -------------------------------------------------------------------------- */

export const events: WeddingEvent[] = [
  {
    id: 'nikah',
    name: 'Nikah',
    arabicName: 'نكاح',
    dateTime: '2026-08-07T17:00:00+05:30',
    timeLabel: '5:00 PM',
    venue: 'Taliparamba Masjid',
    address: 'Taliparamba, Kannur, Kerala',
    description:
      'The solemnisation of our marriage, followed by dua. We would be honoured to have you witness our nikah and share in the blessings of the day.',
    icon: 'nikah',
    mapsUrl: 'https://maps.google.com/?q=Taliparamba+Juma+Masjid+Kannur+Kerala',
  },
]

/* -------------------------------------------------------------------------- */
/*  SHARING OUR JOY — family standing with the couple                          */
/* -------------------------------------------------------------------------- */

export const sharingOurJoy = {
  title: 'Sharing Our Joy',
  subtitle: 'With love and prayers from those who stand beside us.',
  names: [
    'Abdu K.P.',
    'Abdul Vaheed K. & Shana',
    'Nadeer Ahammed K. & Ayisha',
    'Rubeena Azad & Azad',
    'Shahna Noushad & Rashid',
    'Shabeer & Jaseela',
  ],
} as const

/* -------------------------------------------------------------------------- */
/*  CONTACT & SOCIAL                                                           */
/* -------------------------------------------------------------------------- */

export const contact = {
  // VERIFY: the floating WhatsApp button opens a chat to this number. International
  // format, digits only. Confirm it is actually on WhatsApp.
  whatsapp: '919526222228',
  /** Shown in the footer and dialable on mobile. */
  phones: ['+91 9526 222 228', '+91 9747 222 228'],
  email: 'nishadmo7@gmail.com',
} as const

export const socials: SocialLink[] = [
  { label: 'Email us', href: 'mailto:nishadmo7@gmail.com', icon: 'mail' },
  { label: 'Call us', href: 'tel:+919526222228', icon: 'phone' },
]

/* -------------------------------------------------------------------------- */
/*  MUSIC                                                                      */
/* -------------------------------------------------------------------------- */

export const music = {
  /** Missing or undecodable file → the toggle disables itself silently. */
  src: '/music/bg-music.mp3',
  title: 'Background music',
  volume: 0.32,
  /**
   * The page stays silent until a guest taps the music button themselves.
   *
   * Set true to start it on "Open Invitation" instead. Even then it can only
   * ever begin from that click — browsers block audio without a gesture, and a
   * page that makes noise unbidden is worse than a silent one anyway.
   */
  autoplayAfterOpen: false,
} as const

/* -------------------------------------------------------------------------- */
/*  SHARE / SEO                                                                */
/* -------------------------------------------------------------------------- */

export const site = {
  title: `${groom.firstName} & ${bride.firstName} — Nikah Invitation`,
  shareText: `You are cordially invited to the Nikah of ${groom.firstName} & ${bride.firstName}, ${wedding.dateLabel}.`,
  url: typeof window !== 'undefined' ? window.location.href : '',
} as const

/* -------------------------------------------------------------------------- */
/*  THEME TOKENS (mirrors styles/index.css — for JS-side consumers)            */
/* -------------------------------------------------------------------------- */

export const theme = {
  bg: '#FFFCF8',
  gold: '#C8A96A',
  goldSoft: '#E3D3AE',
  goldDeep: '#A8863F',
  emerald: '#0E5A4E',
  emeraldDeep: '#083830',
  ivory: '#F8F5EF',
  ink: '#2D2926',
  muted: '#6B625A',
  glass: 'rgba(255,255,255,0.65)',
} as const

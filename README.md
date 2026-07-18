# Nikkah Invitation — Nishad & Lubna

**Friday, 7 August 2026 · 5:00 PM · Babil Greens Convention Centre** — reception at the same venue.

A premium single-page Nikkah invitation. React 19 · Vite · TypeScript · Tailwind v4 · Framer Motion · GSAP + ScrollTrigger · Lenis · Lucide · Day.js.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

---

## 1. Add your assets

The site runs right now without them — every missing image falls back to a girih-patterned
ivory panel with a gold seal, so nothing ever shows a broken icon. Drop the real files at
these **exact paths** and they take over with no code change.

| Path                           | Used by                             | Suggested size      |
| ------------------------------ | ----------------------------------- | ------------------- |
| `public/images/bride.jpg`      | Couple section (arch-cropped, 5:7)  | 1000×1400           |
| `public/images/groom.jpg`      | Couple section (arch-cropped, 5:7)  | 1000×1400           |
| `public/music/nasheed.mp3`     | Music toggle                        | < 3 MB, loops well  |

Portraits are clipped to a pointed arch, so keep faces in the **upper-middle** of the frame.
If no mp3 is present the music button disables itself automatically.

## 2. Edit the content

**Everything** editable lives in [`src/data/wedding.ts`](src/data/wedding.ts) — no component
hardcodes content. Fields worth double-checking are marked `// VERIFY:`.

- `groom` / `bride` — names, parents, Arabic names
- `hosts` — Nishad's grandparents, who extend the invitation
- `brideHome` — the bride's family address
- `wedding` — date (drives the countdown), quote, Bismillah, invitation message
- `venue` — name, address, Maps links, keyless embed URL
- `events` — single combined Nikkah & Reception card
- `sharingOurJoy` — the family names list
- `dressCode` — palettes (the hex values render as actual swatches)
- `blessings` — duas; `payment.enabled: false` hides all gift info
- `rsvp`, `contact`, `socials`, `music`

### ⚠ Three things to confirm

1. **The Maps link is the supplied Babil Greens pin.** `venue.mapsUrl`
   points to the shared Google Maps URL for Babil Greens Convention Centre.
2. **The reception is merged into the Nikkah card** — both are on the same date and at the same venue.
3. **The Hijri date** (`24 Safar 1448`) is Umm al-Qura reckoning; local moon sighting may differ.

### Deliberately left out

No "Our Journey" timeline and no couple bios — neither was supplied, and inventing a real family's
history isn't something a wedding invitation should do. Both are easy to add back if you want them.

### The Google Maps embed needs no API key

`venue.embedUrl` uses `output=embed`, which requires no key and no billing account.
Swap the `q=` value for your venue name or `lat,lng`.

### RSVP has two modes

```ts
mode: 'whatsapp'   // default — opens a prefilled WhatsApp message. No backend.
mode: 'endpoint'   // POSTs JSON to `endpoint` (Formspree, Apps Script, your API)
```

Set `contact.whatsapp` to a real number in international format, digits only.

## 3. Before you deploy

- [ ] Replace every `// TODO:` in `src/data/wedding.ts`
- [ ] Add the three images + music file
- [ ] Update `<title>`, description, `og:image` and the JSON-LD block in `index.html`
- [ ] Update the **boot shell** in `index.html` (see below) — the one place content is duplicated
- [ ] Set the real domain in `public/robots.txt`

### The boot shell is the one exception to "edit only wedding.ts"

`index.html` contains a small static `<div id="boot">` with the couple's initials. It is plain
HTML with inline styles, so it paints on the first frame — the React app can't, because it must
parse first. Without it, first paint was **4.2s**; with it, **1.5s**.

Two rules if you touch it:

1. **Keep the initials in sync** with `groom.initial` / `bride.initial` (currently **N ◆ L**).
2. **Keep `font-size: 3rem`** matching the preloader's monogram. If the shell's copy is smaller,
   React's paints later as a *larger* element and becomes the Largest Contentful Paint — which
   silently cost ~2.5s of LCP while it was mismatched.

---

## Structure

```
src/
├─ components/
│  ├─ Loading/          Preloader — the seal draws itself, then the doors part
│  ├─ Hero/             Ken Burns + parallax + ornate frame
│  ├─ Invitation/       Bismillah card + the hosting grandparents
│  ├─ Couple/           Arch-cropped portraits + vertical divider
│  ├─ Countdown/        Rolling digits on emerald
│  ├─ Events/           Nikkah & Reception glass card
│  ├─ Venue/            Keyless Maps embed, warmed into the palette
│  ├─ DressCode/        Colour swatches, no photography
│  ├─ SharingJoy/       Family names, staggered in by GSAP ScrollTrigger
│  ├─ Blessings/        Duas — gifts hidden by default
│  ├─ RSVP/             Validation + the seal re-drawing on success
│  ├─ Footer/           Blurred house image
│  ├─ MusicButton/      Equaliser toggle with fades
│  ├─ FloatingDock/     Music · WhatsApp · Share · Scroll-to-top
│  ├─ ScrollProgress/   Gold thread
│  ├─ FloatingPatterns/ Ambient ornaments + particles
│  └─ ui/               Ornaments, Reveal, GlassCard, Button, SmartImage
├─ hooks/               useLenis · useCountdown · useMusic · useShare · useReducedMotion
├─ utils/               cn · date · validation
├─ data/wedding.ts      ← all content
└─ styles/index.css     Tailwind v4 @theme
```

## Design notes

- **The khatim.** An 8-fold seal, constructed from two overlaid squares the way the geometry is
  classically built. It draws itself in the preloader, marks every divider, and re-draws on RSVP
  success — so the site opens and closes with the same gesture.
- **Ornaments are geometry, not images.** Every pattern is a constructed SVG (`ui/Ornaments.tsx`)
  inheriting `currentColor`, which is why there are no decorative image assets to ship.
- **Emerald as spine.** The Preloader, Countdown and Footer are dark; everything between them is
  paper. The inversions give the scroll its rhythm.
- **Reduced motion is honoured throughout** — Lenis doesn't initialise, parallax and Ken Burns are
  dropped, and every reveal renders instantly. A real path, not a token gesture.

## Performance

- Lazy-loaded below-the-fold sections; React / Motion / GSAP / Lenis in their own chunks
- Lenis driven by GSAP's ticker — one RAF loop, not two
- Countdown re-derives from the wall clock and pauses on a hidden tab
- Animations stay on `transform` / `opacity`
- Audio uses `preload="none"` until the guest asks for sound

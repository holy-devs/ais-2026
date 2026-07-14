# ROUND-B — deferred work ledger

Carried over from the wave2 polish + documentary sessions. These were explicitly
deferred out of Round A (wave2 A1–A7, documentary embed, client rounds). Each item
notes scope, the driver, and any known constraints. Confirm specifics with the
designer / Odysseas before building — several are content or Figma-dependent.

---

## Session ledger — 2026-07-14 (M1–M12 designer batch, shipped to production)

Merged to `main` (PR #7, `7a4e718`) and live. Verified 390px + desktop + production `?fresh=1`.

**Closed today:**
- **Buttons → M10** — `GlassButton variant="solid"` (white fill / black text+arrow / dark
  dashed connector) on **Revisit 2025/2022** and **Visit Archive** only. Hero
  (Get Tickets / Past Editions), nav, and footer Subscribe stay glass (designer
  exception). Supersedes the site-wide item #1 and the hero-connector item #10.
  Solid hover = `bg-white/90` default (flagged to designer for confirmation).
- **Press → M11** — empty press-image box removed (renders only when an image exists;
  the CMS field is deferred and returns on its own); each press card with a `sourceUrl`
  is now a link (new tab, `rel=noopener noreferrer`, title-underline hover). Covers item
  loosely related to press richness.
- **Sidetray caps + card stack → M12** — past-event modal desktop caps (hero max-h 650,
  documentary max-h 460 = v.4 694×460, object-cover); SpeakerCard text+CTA vertical
  stack (name → title → CTA below, left-aligned). Card work overlaps item #4.
- **Gallery ratio → M9** — shared GalleryTile to v.4 spec: padding 10px, inner image
  aspect 332/376 (0.883), creme 0.5px border kept. Three surfaces, one change.
- Also shipped M1–M8 mobile polish (footer crosshairs, subscribe centering, hero
  mobile centering, key-info divider, sidetray header alignment, footer columns,
  section-title unification, speaker-card media cap + CTA weight).

**Still open (carried forward):**
- **Documentary → landscape v.4** — M12a only *caps* the height (460); the full 3:4→
  landscape 694×460 rest treatment (item #2 / v.4 node) is not yet built.
- **Archive card flexbox** — horizontal desktop layout, buttons right (item #3).
- **Generic CTA label** — the "View Keynote / View LinkedIn" label generalization.
- **Body paragraphs** — long body copy → paragraph breaks (item #6).
- **Gallery -04/-09 visual recrop** — contact sheet published (recommend END-447 →04,
  END-394 →09); **pending designer pick**, then upload + relink + publish. Note the
  homepage gallery is 20 assets (repo seed script is stale at 12); real photos, the
  END/ais25 sets. Current -04/-09 crop poorly even at 0.883.
- Sidetray v2 (item #8), homepage 2026 speaker popups (item #9) — unchanged.

---

## 1. Button system overhaul (designer, NEW) — likely the biggest item
- **Primary button = solid fill `#FFFFFF` / black text**, applied to **ALL** buttons site-wide.
- **Glass/blur is retained ONLY on the hero "Past Editions" button**, as the *secondary* style.
- Implementation: add a **`variant` prop to `GlassButton`** (`primary` = default solid,
  `glass` = opt-in). Migrate every call site to the new default; opt the hero
  "Past Editions" action into `glass`.
- **Hover states: TBD with the designer** — do not invent; get the spec first.
- Note: this likely **supersedes item #10** (hero two-container/connector treatment) — confirm.
- Touches: `components/Buttons.tsx` (GlassButton), all consumers (Nav, Hero,
  TicketSection, Footer, modals, SpeakerCard CTA).

## 2. Documentary block → permanent 16:9 when a video exists
- Current (Round A shipped): rest = 3:4 poster, **click expands 3:4 → 16:9** + youtube-nocookie.
- Round B: when `documentaryVideoUrl` is present, render the block **16:9 from the start**
  (no expand). No-URL state stays 3:4 empty block.
- Small change in `components/modals/Documentary.tsx` (the padding-bottom hack already
  in place; effectively drop the 3:4 rest ratio when a video exists).

## 3. Archive card → horizontal flex on desktop
- Desktop: **flexbox horizontal**, buttons on the **right**. Vertical layout **mobile only**.
- Touches the past-event archive card component (the "AIS Archive" cards on the homepage).

## 4. Speaker cards
- Image **`max-height: 420px`**.
- CTA label → **Medium** font weight.
- Touches `components/SpeakerCard.tsx` (shared homepage + past-event modal).

## 5. Sidetray hero photo → grayscale
- Apply a **grayscale filter** to the speaker sidetray hero photo (the edition cards
  already grayscale). Touches `components/modals/SpeakerSidetray.tsx` (the `Frame` hero).

## 6. Body copy → paragraph breaks
- Break long body copy into **paragraphs as shown in the UI** (currently rendered as
  single blocks in places). Likely a content + rendering change (rich-text / `\n\n`
  handling). Confirm which sections.

## 7. Gallery assets — swap / re-crop (CONTENT task, no code)
- The 12 curated homepage gallery images are almost all 3:2 landscape; at the new 5:7
  portrait tiles they crop heavily. Odysseas to **swap or portrait-re-crop**:
  - **Bad:** `ph-gallery-04` (END-600), `ph-gallery-09` (ENDEAVOR-9)
  - **Borderline:** `ph-gallery-03` (END-637), `ph-gallery-05` (END-550), `ph-gallery-08` (ENDEAVOR-132)
  - Good as-is: `-01 -02 -06 -07 -10 -11 (native portrait) -12`.

## 8. Sidetray v2 (Mapping v2 / Figma node 59-4025)
- New schema + content for the speaker sidetray. **Requires a Figma pull** (node 59-4025)
  and a Contentful model diff (follow the CLAUDE.md model-diff → approve → apply flow).

## 9. Homepage 2026 speakers popups
- **Parked by Odysseas.** 2026 speaker cards should open profile popups (like past-event).
  Blocked on Odysseas's input / content readiness.

## 10. Primary CTA hero treatment (two-container / connector)
- The earlier two-container + connector concept for the hero primary CTA.
- **Likely superseded by item #1** (new solid-fill button system) — **confirm with the
  designer before building.**

---

### Process reminders for next session (from Round A)
- **Client/server boundary:** value imports that transitively pull `lib/contentful`
  throw in the client bundle (module-level env check). Keep client-usable helpers
  dependency-free (see `lib/cta.ts`, `lib/youtube.ts`); import types with `import type`.
- **CSS transitions:** `aspect-ratio` and `transition-all` on `top` (vh→px) do NOT
  animate reliably — animate `padding-bottom` / use `transition-colors` instead.
- **Preview verification:** Vercel previews are SSO-gated (can't curl) and serve the
  pre-publish ISR build first — reload once after Contentful publish; verify in-browser.
- **Contentful writes** are additive-only per CLAUDE.md; publish (not just save) or the
  Delivery API won't serve the field.

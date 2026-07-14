# ROUND-B — deferred work ledger

Carried over from the wave2 polish + documentary sessions. These were explicitly
deferred out of Round A (wave2 A1–A7, documentary embed, client rounds). Each item
notes scope, the driver, and any known constraints. Confirm specifics with the
designer / Odysseas before building — several are content or Figma-dependent.

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

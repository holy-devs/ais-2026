# OPEN — visual-pass decisions, hardcodes & awaiting-materials

Running log for the AIS 2026 visual fidelity pass (branch `visual-pass`).
Ground truth = `design-refs/` (v5.0). No Contentful writes in this pass.

## Decisions / discrepancies (client to confirm)
- **Partners section:** v5.0 desktop has **no rendered partners/logos section**
  (Tickets → About → Footer; logo-blocks were empty placeholders in the design).
  Per ruling we **keep the live site section** (currently Google + Endeavor) — the
  client expects sponsors. Phase 6 will style it after `Components.png` logo-block /
  info-bar conventions. Sponsor logos (NBG, Raycap, Eurobank) still awaited.
- **`#program` anchor:** nav "PROGRAM" → `#program` **resolves** to the Keywords
  strip (`components/Keywords.tsx` has `id="program"`). Earlier "dead anchor" note
  was stale. Re-verify once in the Phase 6 sweep.
- **Footer social — TIKTOK vs X/TWITTER:** `footer.png` shows TIKTOK; the live model
  has a working X/TWITTER link (and an empty TIKTOK). Keep the working **X** link;
  client to confirm which they want. (Decided: keep current, log only.)
- **Ticket CTA label:** `tickets.png` (and the Phase-4 brief) show the button as
  **"Request Access"**; the CMS action (`act-request-tickets`) reads **"Request
  Tickets"** (→ mailto). Kept the CMS label per "keep existing copy verbatim" + no
  writes (same policy as nav/TIKTOK). Client to confirm the final label.
- **Nav labels:** design shows Speakers / Program / Past Editions; CMS menu json has
  SPEAKERS / PROGRAM / GALLERY / ABOUT ENDEAVOR / REQUEST TICKETS. Keeping CMS labels
  (read-only), restoring the wordmark + send icon + corner `+`. Client to confirm
  final nav label set.

## Content discrepancies (rendered as-is — no CMS edit)
- **Vision body paragraphs:** `vision.png` shows the body as **two** paragraphs
  (break before "In 2026, the Summit ascends the Pnyx…"), but the CMS `sec-stats.text`
  field is a **single** paragraph block (775 chars, verified via Delivery API).
  Rendered as-is per ruling #6. To match the ref, split the field into two paragraphs
  in Contentful (content edit, not part of this visual pass).

## Type system
- Stand-ins: Inter (≈ Founders Grotesk) and Instrument Serif (≈ PP Editorial Old).
- Swap to licensed faces: load the font in `app/layout.tsx` (expose a CSS var) and
  point `--font-grotesk` / `--font-editorial` at it in `app/globals.css`. One line
  each; no component changes.

## Hardcoded content (not in the CMS model — wire in later)
- **Hero coordinates** (`components/sections/Hero.tsx`): `37.9838°N / 23.7275°E` +
  `Athens, Greece`. Not present on the hero entry; hardcoded per ruling. Wire into
  the model later (e.g. a `coordinates` / `locationLabel` field on the hero section).
- **Footer display copy** (`components/Footer.tsx`): "STAY IN THE" / "LOOP" is a
  decorative display headline not present in the footer json — hardcoded per ruling.
- **Thank-you Revisit buttons** (`components/sections/ThankYou.tsx`): `Revisit 2025`
  + `Revisit 2022`, both → `#ais-archive`. Not on the thank-you entry; hardcoded per
  ruling. Wire as actions on the section later.
- **Thank-you background — RESOLVED** (was `public/thankyou-temp.png`, now deleted):
  Endeavor supplied the real panel photo. Uploaded as Contentful asset
  `thankyou-panel` ("AIS 2026 - Thank You Panel", 1450×648) and linked onto
  `sec-thank-you.media` (scoped, approved write). `ThankYou.tsx` now reads
  `section.media`; the asset carries its own baked gradient so the extra flat-35
  overlay was dropped. All three figures now read as in the ref.

## Awaiting materials
- Rafal Modrzewski speaker portrait (from Endeavor) — `ph-spk-modrzewski` still a
  placeholder.
- Official sponsor logos: NBG, Raycap, Eurobank (dark-bg / reversed variants from
  press kits).
- Higher-res thank-you panel original (2000px+ wide) still welcome from Endeavor —
  the delivered file is 1450×648 and may soften on very large displays. (Base photo
  is now wired: asset `thankyou-panel` on `sec-thank-you.media`.)

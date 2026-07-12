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
- **Thank-you Revisit buttons** (`components/sections/ThankYou.tsx`): `Revisit 2025`
  + `Revisit 2022`, both → `#ais-archive`. Not on the thank-you entry; hardcoded per
  ruling. Wire as actions on the section later.
- **Thank-you background — TEMPORARY** (`public/thankyou-temp.png`): a text-free crop
  of the panel photo from `Desktop.png` (no such asset in the CMS; gallery/archive do
  not contain it; the Figma thank-you Container node has no photo fill, so the clean
  full photo can't be isolated there). The scene's left figure (a woman) is baked
  under the design's copy, so an all-three clean crop is impossible — using the widest
  clean region (the two men + stage), with our copy over the left as in the ref.
  Placeholder only — replace with the real panel photo as a Contentful asset wired
  onto the thank-you entry.

## Awaiting materials
- Rafal Modrzewski speaker portrait (from Endeavor) — `ph-spk-modrzewski` still a
  placeholder.
- Official sponsor logos: NBG, Raycap, Eurobank (dark-bg / reversed variants from
  press kits).
- Original thank-you panel photo (currently a temporary crop, see above) — supply as
  a proper Contentful asset and wire onto the thank-you section entry.

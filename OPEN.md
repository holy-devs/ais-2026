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

## Type system
- Stand-ins: Inter (≈ Founders Grotesk) and Instrument Serif (≈ PP Editorial Old).
- Swap to licensed faces: load the font in `app/layout.tsx` (expose a CSS var) and
  point `--font-grotesk` / `--font-editorial` at it in `app/globals.css`. One line
  each; no component changes.

## Hardcoded content (not in the CMS model — wire in later)
_(none yet — added per phase as sections are rebuilt)_

## Awaiting materials
- Rafal Modrzewski speaker portrait (from Endeavor) — `ph-spk-modrzewski` still a
  placeholder.
- Official sponsor logos: NBG, Raycap, Eurobank (dark-bg / reversed variants from
  press kits).

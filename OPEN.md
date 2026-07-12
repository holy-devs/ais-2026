# OPEN — AIS 2026 visual pass · review agenda

Branch `visual-pass`. Ground truth = `design-refs/` (v5.0). The pass was read-only
except one approved write (thank-you panel asset). Grouped for review below.

## 1. Needs client decision (copy/label — pick before launch)
- **Ticket CTA label:** live shows **"Request Tickets"** (CMS `act-request-tickets` →
  mailto); design shows **"Request Access"**. Kept CMS per keep-verbatim. Confirm.
- **Footer social — TIKTOK vs X/TWITTER:** design shows **TIKTOK**; live keeps the
  working **X/TWITTER** link (CMS TIKTOK has no URL). Confirm which to ship.
- **Nav labels (top nav + side menu):** CMS has 5 UPPERCASE items (SPEAKERS / PROGRAM /
  GALLERY / ABOUT ENDEAVOR / REQUEST TICKETS); design shows 3 Title-Case (Speakers /
  Program / Past Editions). Kept CMS. Confirm the final label set.
- **Vision stat body:** design breaks it into **two** paragraphs (before "In 2026, the
  Summit ascends the Pnyx…"); CMS `sec-stats.text` is a **single** block. Rendered
  as-is. Split in Contentful to match.

## 2. Awaiting materials (from Endeavor)
- **Rafal Modrzewski** speaker portrait — `ph-spk-modrzewski` is still a placeholder
  (the only remaining `placeholder-*` on the live site).
- **Sponsor logos:** NBG, Raycap, Eurobank — dark-bg / reversed variants from press
  kits. (Partners section is live with Google + Endeavor; sponsors slot in when they
  arrive.)
- **Higher-res thank-you panel** (2000px+ wide) — delivered file is 1450×648 and may
  soften on very large displays.

## 3. Future model additions / content to populate (for full ref fidelity)
- **Speaker modal Visuals / Press:** the `person` type already HAS `bio` / `visuals` /
  `press`; populate them and the (already built, ref-styled) modal sections light up.
- **Past Event modal:** `speakerNames` are strings, not linked `person` entries, so the
  ref's portrait speaker cards render as a name list — link them to enable cards. No
  `keynote/press` field exists → the ref's Keynote cards are omitted (add a field).
  `gallery` exists but is unpopulated.
- **Hero coordinates:** `37.9838°N / 23.7275°E · Athens, Greece` is hardcoded — add
  `coordinates` / `locationLabel` fields to the hero section to make it CMS-driven.
- **Thank-you Revisit buttons:** `Revisit 2025` / `Revisit 2022` (→ `#ais-archive`) are
  hardcoded — add as `actions` on the thank-you section.
- **Footer display copy:** "STAY IN THE / LOOP" is hardcoded — optional CMS field.

## Resolved (for the record)
- **Thank-you background:** real panel photo uploaded as asset `thankyou-panel`
  ("AIS 2026 - Thank You Panel", 1450×648) and wired to `sec-thank-you.media` (the one
  approved write); temp `public/thankyou-temp.png` deleted; carries its own gradient
  (no extra scrim); all three figures read as in the ref.
- **`#program` anchor:** resolves to the Keywords strip (`id="program"`). No fix.
- **Content width:** unified to a single token `--content-w: 1392px` via
  `.max-w-content` — cannot drift.
- **Media:** placeholder styling (dashed box) no longer leaks onto real images; no
  rounded media anywhere (design uses full-bleed, un-bordered photography).
- **pnpm dev:** `sharp` build allowlisted in `pnpm-workspace.yaml` (`allowBuilds` +
  `onlyBuiltDependencies`) — `pnpm dev` runs out of the box.

## Type system (swap to licensed faces later)
- Stand-ins: Inter ≈ Founders Grotesk, Instrument Serif ≈ PP Editorial Old.
- Swap: load the licensed font in `app/layout.tsx` (expose a CSS var) and point
  `--font-grotesk` / `--font-editorial` at it in `app/globals.css`. One line each; no
  component changes.

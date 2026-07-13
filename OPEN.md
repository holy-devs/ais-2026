# OPEN — AIS 2026 visual pass · review agenda

Branch `visual-pass`. Ground truth = `design-refs/` (v5.0). The pass was read-only
except one approved write (thank-you panel asset). Grouped for review below.

## 1. Needs client decision (copy/label — pick before launch)
- **Ticket CTA label:** live shows **"Request Tickets"** (CMS `act-request-tickets` →
  mailto); design shows **"Request Access"**. **Polish-pass ruling (E4): keep
  "Request Tickets"** (client copy decision) — no change. Confirm at launch.
- **Footer social — TIKTOK vs X/TWITTER:** design shows **TIKTOK**; live keeps the
  working **X/TWITTER** link (CMS TIKTOK has no URL). Confirm which to ship.
- **Nav labels (top nav + side menu):** polish-pass now renders CMS labels in
  **Title Case** (front-end, review B1) and **drops the Program item** (F1 — no
  Program section this cycle). Shipped set: Speakers / Gallery / About Endeavor /
  Request Tickets. Design shows Speakers / Program / Past Editions. **Final label
  set still a client decision** (esp. Gallery-vs-Past-Editions, and whether Program
  returns). CMS untouched.
- **Nav "Program" dropped (F1):** no Program/schedule section exists or is scoped, so
  the nav Program link + orphaned `#program` anchor are removed front-end. `Program.png`
  in the review folder actually shows the Thank-You panel (mislabeled). **Pending client
  confirm** that no Program section is coming; if it is, re-add link + build section.
- **Vision stat body:** design breaks it into **two** paragraphs (before "In 2026, the
  Summit ascends the Pnyx…"); CMS `sec-stats.text` is a **single** block. Rendered
  as-is. Split in Contentful to match (designer-confirmed, but a CMS content write —
  route via the scoped-content step, not the polish pass).

## 2. Awaiting materials (from Endeavor)
- **Rafal Modrzewski** speaker portrait — `ph-spk-modrzewski` is still a placeholder.
  **Polish-pass (F4): his card is now HIDDEN in production** — the Speakers grid ships
  only speakers with a real portrait (currently 3). Re-appears automatically once the
  portrait asset is swapped in (and client announcement is confirmed). No placeholder
  card in prod.
- **Gallery lightbox design-intent** — click-to-enlarge is now **shipped** per the
  designer's spec (overlay #161524/85% + 30px page blur, contain, ✕, looping ◀/▶,
  Esc/click-out/arrows, focus trap, reduced-motion). Manmeet's open question was whether
  the grid should be interactive at all; if he says non-interactive, gate it off.
- **Sponsor logos:** NBG, Raycap, Eurobank — dark-bg / reversed variants from press
  kits. **The Organisers/Sponsors section is removed from the page this cycle** (see
  Resolved); it returns next year when official logos arrive.
- **Higher-res thank-you panel** (2000px+ wide) — delivered file is 1450×648 and may
  soften on very large displays.

## 3. Future model additions / content to populate (for full ref fidelity)
- **Speaker modal Visuals / Press:** the `person` type already HAS `bio` / `visuals` /
  `press`; populate them and the (already built, ref-styled) modal sections light up.
- **Past Event tray (rebuilt C3, 800px):** now has the mosaic hero + meta, 2-col speaker
  cards, and a 2-col Visuals grid + Load More. Two ref sections are **omitted (no model
  field) — not faked**, and need fields added to `pastEvent` to light up:
  - **Video/Documentary slot** — add a `documentary`/`videoUrl` (+ optional poster) field.
  - **Keynote/Program cards** — add a `keynote`/`program` field (panel image + title +
    date/desc). The design flags this "not sure if it will be used."
  - **Speaker cards** still show the **name only** — `speakerNames` are strings, not linked
    `person` entries; link them to get portrait/role/bio cards.
  - `gallery` exists but is unpopulated → Visuals grid is empty until filled.
- **Hero coordinates:** `37.9838°N / 23.7275°E · Athens, Greece` is hardcoded — add
  `coordinates` / `locationLabel` fields to the hero section to make it CMS-driven.
- **Thank-you Revisit buttons:** `Revisit 2025` / `Revisit 2022` (→ `#ais-archive`) are
  hardcoded — add as `actions` on the thank-you section.
- **Footer display copy:** "STAY IN THE / LOOP" is hardcoded — optional CMS field.

## Resolved (for the record)
- **Partners section removed (this cycle):** gated off in `SectionRenderer.tsx`
  (`PARTNERS_ENABLED = false`) — front-end only; `sec-partners` refs and the two live
  assets are untouched (no Contentful writes). Matches v5.0 (no partners section).
  **Re-enable next year:** flip the flag AND first replace the logo assets — the two
  LIVE assets `ph-partner-01` / `ph-partner-02` are **known-bad flattened white
  squares** (qlmanage baked the transparent SVGs onto white → 100% opaque white,
  byte-identical; do NOT reuse). The fix is parked in **`scripts/partner-logos/`**
  (see its README): verified transparent PNGs (`google.png`, `endeavor.png` — 1200×800,
  3:2, ~92%/97% transparent, distinct), the sources, and `make-logos.mjs` + the sharp
  recipe. Scoped file-replace on the same asset IDs when the section returns.
- **Hero "by endeavor" lockup:** replaced the plain text with the official wordmark
  (`public/endeavor-logo.svg`) inlined as `<EndeavorWordmark>` (currentColor). Wordmark
  appears only here in the refs (nav = AIS wordmark, footer = HØLY) — matched only there.
- **Vertical rhythm:** section padding centralized to `--sp-section` / `.section-y`
  (~44px/side ≈ 88px gaps, was ~224px). No `min-h`/`mt-auto` fillers remain (the Hero
  full-height and 522px ticket are intentional).
- **Info bar:** now a full-bleed dark band with the four tiles inset (page padding +
  vertical band padding) instead of flush edge-to-edge.
- **Thank-you background:** real panel photo uploaded as asset `thankyou-panel`
  ("AIS 2026 - Thank You Panel", 1450×648) and wired to `sec-thank-you.media` (the one
  approved write); temp `public/thankyou-temp.png` deleted; carries its own gradient
  (no extra scrim); all three figures read as in the ref.
- **`#program` anchor:** ~~resolves to the Keywords strip~~ — **polish-pass: Keywords/ticker
  strip is hidden (review B8) and the `#program` anchor + nav link are dropped (F1).**
  `KEYWORDS_ENABLED = false` in `SectionRenderer.tsx`; component kept for future revival.
- **Content width:** unified to a single token `--content-w: 1392px` via
  `.max-w-content` — cannot drift.
- **Media:** placeholder styling (dashed box) no longer leaks onto real images; no
  rounded media anywhere (design uses full-bleed, un-bordered photography).
- **pnpm dev:** `sharp` build allowlisted in `pnpm-workspace.yaml` (`allowBuilds` +
  `onlyBuiltDependencies`) — `pnpm dev` runs out of the box.

## Desktop punch-list — Figma "Final UI 2026" type specs (polish pass)
Applied desktop-only, no Contentful. Exact metrics from the v5.0 frame:
- **Speaker card role line** (`SpeakersClient`): 16px / 18px lh / Founders Regular /
  **#FFF 100%** / ls 0 (was 14px muted `text-mid`).
- **Speaker card detail line** (bio one-liner): 14px / 14px lh / ls **−2%** / **#FFF 70%**
  (was 12px `text-low`). The 70% muting is **intended** — kept, only the size fixed.
- **Archive speaker-name lists** (`ArchiveClient`): 16px / 18px lh / Founders Regular /
  **#FFF 100%** / ls 0 (was 12px greyed `text-mid` — size bumped **and** un-muted).
- **Vision headline** (`VisionStats`): 64px (`lg:text-[64px]`) / 52px lh (ratio 0.8125) /
  ls 0 / #EEDECB / **max-width 594px** (dropped the old `max-w-[8.5em]`) → correct wrap.
- **Lightbox overlay** (`Lightbox`): was `bg-[#161524]/85` compiling to
  `color-mix(in oklab, … transparent)` (renders darker/near-opaque); switched to the
  explicit 8-digit hex **`#161524D9`** = clean sRGB 85% + 30px blur.

## Type system — real fonts wired
- **Founders Grotesk** (Regular + Medium) + **PP Editorial Old Italic**, self-hosted
  via `next/font/local` (`app/fonts/`, `app/layout.tsx`) into the `--font-grotesk` /
  `--font-editorial` tokens. Inter / Instrument Serif stand-ins removed. next/font emits
  a size-adjusted fallback → no layout shift.
- ⚠️ **LICENCE (open):** the Founders Grotesk files are **Klim TRIAL** ("Test Founders
  Grotesk"). Production licence to be confirmed with the designer — then drop the
  licensed woff2 into `app/fonts/` (same filenames/weights). One-file swap, no code
  change. PP Editorial Old is the full family.

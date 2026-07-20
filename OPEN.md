# OPEN — AIS 2026 visual pass · review agenda

Branch `visual-pass`. Ground truth = `design-refs/` (v5.0). The pass was read-only
except one approved write (thank-you panel asset). Grouped for review below.

## Client updates round — branch `fix/client-round-2`
All items on one branch, additive-only CMS, front-end gates removed in favour of
publish-driven visibility. Ground truth confirmed from the live space before each change.

- **Item 1 — 4th speaker un-hidden (front-end only, no CMS write).** `Speakers.tsx` had a
  hardcoded portrait gate (`.filter` dropping placeholder/no-portrait speakers) that hid
  the not-yet-announced 4th (Modrzewski). His **profile image is now a real PUBLISHED
  asset** ("Rafał Modrzewski") and the entry is published, so the gate is **removed** —
  Speakers now renders every speaker linked in the published section (publish-driven).
  Verified: all four (Mitsotakis / Rottenberg / Taneja / Modrzewski) render. Contentful
  untouched for this item. Supersedes §2 "Rafal Modrzewski" + the polish-pass F4 hide.

- **Item 5 — Partners now publish-driven (front-end only, no asset writes).** Removed the
  hardcoded `PARTNERS_ENABLED = false` gate in `SectionRenderer.tsx`; the Logo Assets
  section now renders **iff its entry is published** (`Partners.tsx` also returns null on
  empty logos). **Nothing becomes visible today** because **both partner sections
  (`sec-partners`, `sec-partners-secondary`) are DRAFT/unpublished.**
  ⚠️ **Correction to the brief:** the two logo **assets `ph-partner-01` (Google) /
  `ph-partner-02` (Endeavor) are PUBLISHED** (publishedVersion 8), NOT unpublished — the
  invisibility comes from the unpublished **sections**, not the assets. They remain the
  known-bad flattened white squares; **not touched, not republished.**
  **Return-flow:** replace the two assets with the parked fixed transparent PNGs in
  `scripts/partner-logos/` (see its README) — a scoped same-ID asset swap — **then publish
  the partner section(s).** Do NOT reuse the current bad assets.

- **Item 7 — Thank-You mobile background (additive model + `ThankYou.tsx` only).**
  - **Correction:** the current Thank-You background is an **image** (`thankyou-panel`,
    `image/webp`), not a video — rendered via `<Media>` (`<img>`). The mobile asset
    replaces that **image** on phones.
  - **Model (additive, approved):** new **optional `Link→Asset` field `mediaMobile`**
    ("Mobile Media") on the **`section`** type — parallels the shipped `heroMediaMobile`
    convention. Editor **help text** set via the editor interface (field descriptions live
    there, not on the CT): "Mobile-only override (phones, below 768px). Replaces the
    section's Media on mobile and falls back to it when empty. Currently read by the Thank
    You section only." **Left UNSET** on `sec-thank-you`. No entry writes, no asset uploads.
  - **Render (`ThankYou.tsx`):** when `mediaMobile` is set, a `<picture>` swaps the mobile
    asset in **below `md` (768px)** (`<source media="(min-width: 768px)">` = desktop
    `media[0]`, `<img>` = mobile), **same `center 25%` framing**; only the matching
    candidate downloads. Unset/unresolved → the original single `<Media>` desktop path,
    on every breakpoint. Desktop **always** uses `media[0]`.
  - **Verified locally (no publish):** unset renders byte-identical to today (home page
    Thank-You still a bare `<img … thankyou-panel … object-position:center 25%>`, no
    `<picture>`); set-state exercised via a throwaway route with a fabricated `mediaMobile`
    (since deleted) → correct `<picture>`/`<source>` swap. **No temp asset published to the
    live space.** Client uploads the real mobile image once the field exists.

### Client updates round — items 2/3/4/6 (same branch)
- **Item 6 — Thank-You button (code).** Replaced the Revisit 2025 / Revisit 2022 pair
  with one secondary glass button **"Revisit Past Editions"** (no icon → static,
  fill-change on hover only) that smooth-scrolls to `#ais-archive` via CSS
  `scroll-behavior`. Still hardcoded (not in the model).
- **Item 2 — 2026 gallery photos.** Source = `~/Downloads` (23 AIS 2026 event photos,
  all JPEG → no HEIC conversion). Uploaded 14 as assets **`ais26-01..14`** (the 7
  ⚠big ZZ8/IMG files downscaled to 2560px long edge q85; the seven 3400px `26-07-16_*`
  as-is). **Prepended 12** to **`sec-gallery.media`** (new first) → 32 total; homepage
  gallery pulls from that field (8 shown + Load More). Two near-dups dropped (ZZ8_4255,
  ZZ8_4900) plus weaker frames.
- **Item 3 — `pe-2026` archive.** New `pastEvent` on the pe-2025 pattern: title "Athens
  Innovation Summit 2026", editionLabel "AIS / 2026", year 2026, location "Pnyx, Athens",
  dateTime **`2026-07-16T21:00+03:00`** (mirrors pe-2025's 21:00 evening format),
  keynoteIntro (client verbatim), 6 speakerNames, sessions/press empty.
  - **heroMedia = `ais26-13`** (2026 Parthenon-dusk shot). ⚠ There was **no shared
    "mosaic"** — pe-2025/2022 use *different* Odeon establishing shots; 2026 is the Pnyx,
    so a 2026 shot was used instead (client-approved).
  - **speakers[]:** 4 new `pastEventSpeaker` (`pes-2026-*`) reusing the homepage portrait
    assets (`ph-spk-*`), no duplicate uploads. Mitsotakis = Keynote CTA (homepage keynote
    URL); Rottenberg/Modrzewski/Taneja = LinkedIn (homepage URLs). Hosts Costantza &
    Panagiotis stay in speakerNames only. Bios = 1-sentence derivations of the keynoteIntro.
  - **visuals/gallery (8):** ais26 12,10,14,03,07,11,05,06 — `ais26-13` (hero) excluded and
    `26-07-16_0041` (ais26-06) substituted so the modal never opens hero+first-tile identical.
  - **Archive wiring:** prepended `pe-2026` → `sec-archive.content` = **pe-2026 → pe-2025 →
    pe-2022** (newest first). Grid `md:grid-cols-2` → 3 cards render 2-up + 1 (2022 wraps to
    row-2 left; 4th slot empty).
- **Item 4 — 2026 documentary.** No model change: set existing
  `pe-2026.documentaryVideoUrl = https://www.youtube.com/watch?v=xnQ-8QQufE8`. Renders via
  the shared `Documentary` component like the other archives (poster → play → 16:9
  youtube-nocookie); poster falls back to the YouTube thumbnail (documentaryMedia unset).
- **Verified** (dev, ISR-busted): gallery new-first; archive 3 cards newest-first; pe-2026
  modal — hero, "16 July 2026 at 21:00", documentary plays, 4 speaker cards (correct
  titles/CTAs), 8 visuals (no hero dup), keynoteIntro verbatim. Screenshots shared.

## Past-event richness (round 2b) — branch `past-event-richness`
Rich past-event modal + the additive Contentful model behind it. All CMS changes
ADDITIVE; live rendering (homepage archive card, existing fields) never touched.
- **Model (additive):** new types **`pastEventSpeaker`** (photo, name, title, bio,
  ctaType[Keynote|LinkedIn], ctaUrl) + **`session`** (title, date, time, description,
  speakers→pastEventSpeaker); new **`pastEvent`** fields `keynoteIntro`, `keynoteMedia`,
  `secondaryMedia`, `documentaryMedia`, `speakers[]`, `sessions[]`. Decision: snapshot
  `pastEventSpeaker` over reusing `person` (edition-specific title/CTA conflict with the
  live 2026 persons). `speakerNames` / `heroMedia` / `gallery` / `description` kept intact.
- **Entries (placeholder):** both `pe-2025` + `pe-2022` populated with **lorem** — 3
  `pastEventSpeaker` + 1 `session` each, ctaType Keynote/LinkedIn/LinkedIn, ctaUrl `#`,
  all media UNSET (→ grey blocks). Real content to be filled in Contentful later. All
  8 entries + 2 pastEvent updates published + delivery-verified.
- **F5-style speakerNames were NOT touched** (kept as-is on both).
- **Modal (`PastEventModal`) rebuilt to node 9-6651:** scrollable 694px container (16px
  pad; mobile inset 12px), header bar `AIS Editions / yy` + E3 ✕, sections in order —
  hero (3:4, title+venue/date overlaid) → documentary (~1:1 grey + 56px play) → speakers
  (shared homepage profile card, 1:1 photos, 2-col desktop / 1-col mobile) → visuals
  (2-col, gap 0, 7:8 tiles, 6 grey when empty; 2022 keeps its real gallery) → keynote
  (eyebrow + intro + ~1:1 keynoteMedia + session cards w/ speaker chips). Headings 48/52
  Founders Regular, eyebrows 14px Medium, grey `#1e1d33`. Unset media → grey blocks, no
  broken-image icons. Homepage Speakers + archive card verified unchanged.
- **Shared `SpeakerCard`** factored from the homepage. `photoAspect` prop: homepage 4:5,
  modal 1:1. In the modal it opens the Speaker Profile sidetray on click.
- Node ref: modal = **9-6651**, sidetray = **9-6786**.

### Press + Speaker Profile sidetray (P5.5–P5.7)
- **Model (additive):** new type **`press`** (title, date, description, byline, sourceUrl)
  + `pastEvent.press` (Array→press). Entries: 2 lorem `press` per edition, linked. All
  published + delivery-verified. `speakerNames`/`speakers`/etc. untouched.
- **Modal PRESS section** (node 9-6651): eyebrow-only (no 48px heading), press cards
  (landscape image block + date/title/description/byline; same base card as sessions but
  **with** an image — grey until a `press.image` field is added; aspect provisional 16:9).
- **Speaker Profile sidetray** (node 9-6786): clicking a modal speaker card opens it
  (sibling overlay, z-60). 800px; "Speaker Profile" 24px bar + E3 ✕; hero = 1:1 (342)
  photo, **mobile vertical / desktop horizontal** (name 24 creme / designation 16 white
  bottom-aligned + CTA); ABOUT (bio 16 white); VISUALS (edition gallery, 2-col gap-16 5:7
  tiles, grey when empty); PRESS. White eyebrows; grey `#1e1d33`; 12/24 padding, 16 gaps.
- **`pastEventSpeaker.bio`** now surfaced in the DTO (feeds the sidetray ABOUT).
- **Open flag:** press-card image aspect = **16:9 provisional** — anchor exact aspect when
  the `press.image` field + real content are added (deferred).

## Favicon / PWA icons — 2026 bundle wired
realfavicongenerator output wired for the App Router.
- **Files in `public/` (names unchanged):** `favicon.ico`, `favicon.svg`,
  `favicon-96x96.png`, `apple-touch-icon.png`, `site.webmanifest`,
  `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` (the manifest
  references the 192/512 PNGs at root paths — kept resolvable).
- **Declared via Next metadata** in `app/layout.tsx` (`metadata.icons` for
  favicon/svg/96px + `apple`, `metadata.manifest`) + `export const viewport`
  `themeColor: '#010010'`. No hand-written `<head>` `<link>` tags.
- **Manifest fixed** off generator defaults: `name` = "Athens Innovation Summit
  2026", `short_name` = "AIS 2026", `theme_color` + `background_color` = brand
  `#010010` (were `MyWebSite` / `#ffffff`).
- **No placeholder to remove** — there was no prior favicon (`/favicon.ico` 404, no
  file-convention icon, no `<link>`/`metadata.icons`); this is a clean add.
- **Verified:** all 7 URLs resolve 200 with correct MIME; served `<head>` has the
  Next-emitted theme-color + manifest + 3 icon + apple-touch tags; manifest serves
  brand values; icon art is the AIS mark; no favicon/manifest 404 in console.

## Ticket CTA site-wide toggle — `ticketsEnabled` (implemented)
One Contentful boolean hides the entire "Get Tickets / Request Tickets" CTA everywhere.
- **Model (additive, the only write):** new **Boolean field `ticketsEnabled`** (default
  `true`) on the **uniqueComponent** content type; set `true` on the Menu entry (`uc-menu`).
  Delivery-verified (`CDA … ticketsEnabled = true`). No other model/content changes.
- **Client toggle:** open the **Menu** entry in Contentful → set `Tickets Enabled` off →
  publish. ISR (`revalidate = 60`) reflects it in ~60s, no redeploy.
- **Wiring (`ticketsEnabled` threaded from `app/page.tsx`):** when `false` —
  - **Nav (desktop + mobile):** Get Tickets button hidden (Menu passes `cta = undefined`).
  - **Hero:** Primary "Get Tickets" action filtered out; `justify-center` flex re-centers
    "Past Editions" with no gap.
  - **Ticket section (variant CTA):** entire section removed in `SectionRenderer`.
  - **Footer + Nav (header/mobile) nav lists:** the **Request Tickets** item
    (→ `#ticket-section`) filtered out — **not just the footer** (your instruction), but
    everywhere it appears, since it would otherwise be a dead link to the hidden section.
    Filtered by anchor `#ticket-section` (robust to label casing). **↳ flagged for review.**
- **Verified** true + false at desktop + mobile: false → ticket section gone, 0 "Get
  Tickets", Past Editions re-centered, 0 `#ticket-section` links anywhere; true → unchanged.
- Default is `true`, so live behaviour is identical to before until the client flips it.

## Polish pass (F1–F6) — status @ F6
Branch `polish-pass`. Ground truth = `design-refs/review/` PNG annotations + Figma
"Final UI 2026". **CLOSED this pass:**
- **Fonts** — real Founders Grotesk (Reg/Med) + PP Editorial Old Italic wired via
  `next/font/local`, no FOUT/CLS. Implementation **closed** (Klim TRIAL→licensed woff2
  is a filename-identical drop-in, the one production pre-req; see Type system below).
- **Systemic (A1/A2)** — glass button system + key-info blocks (Title Case, hover E3→E2,
  crosshair spin). Buttons mobile-reduced blur.
- **Sections (B1–B10)** — nav (Title Case, Program dropped), hero metrics, vision
  (upright Founders), speakers (arrow removed, top crosshairs, 4th hidden), gallery
  (framed + blur teaser + **lightbox**), archive (E2→E3), thank-you (min-h 640 + crop),
  ticker hidden, about, footer.
- **Sidetrays (C1–C3)** — 800px shell, 24px inset, E3 close; speaker two-col +
  ABOUT/VISUALS/PRESS; past-event mosaic + speaker/visuals (video/keynote need fields).
- **Mobile (D1–D4)** — hero 670px cap (key-info peeks), crosshair-over-hamburger,
  mobile-menu glass (#010010/70%), glass CTA. **Verified: sub-`md` layout renders; note
  a true 390px viewport couldn't be captured (macOS clamps window width ~500px) — checked
  at ~500–600px + class/CSS level.**
- **Lightbox** — bottom counter (1/12), thin-line ✕/arrows (sketch), overlay fixed to
  explicit sRGB **#161524D9** (85%) after oklab `color-mix` read near-opaque.
- **Desktop punch-list** — speaker/archive type sizes, vision 594px wrap, lightbox overlay.
- **F5 (Contentful write) — CANCELLED**, live `speakerNames` kept (Hassabis = AIS 2025 is
  correct; the proposed fix had the years reversed). **No CMS writes this pass.**

**F6 verify:** typecheck OK · `next build` OK (4/4 static, no type/lint errors) · 390px/mobile
+ desktop walkthrough on the production build, no console errors. **Push is the brake —
deploying a Vercel PREVIEW only; no merge to main.**

**Still parked (client/materials, not code):** items in §1–§3 below, esp. nav label set,
TIKTOK vs X, Modrzewski portrait, past-event video/keynote fields, sponsor logos.

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
- **Rafal Modrzewski** speaker portrait — ~~`ph-spk-modrzewski` is still a placeholder;
  card HIDDEN in production (polish-pass F4)~~. **RESOLVED (round 2, item 1):** a real
  portrait ("Rafał Modrzewski") is now published and the front-end portrait gate is
  removed — his card ships. See "Client updates round" above.
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
- **Partners section removed (this cycle):** ~~gated off in `SectionRenderer.tsx`
  (`PARTNERS_ENABLED = false`)~~ — **round 2 (item 5) removed the flag; visibility is now
  publish-driven** (both partner sections are unpublished, so still nothing shows). Note:
  the two logo assets are **PUBLISHED** (known-bad), not unpublished — see "Client updates
  round" for the corrected return-flow. `sec-partners` refs and assets untouched.
  **Re-enable next year:** publish the section(s) AND first replace the logo assets — the two
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

## F5 (scoped Contentful write) — CANCELLED
The planned correction of pastEvent `speakerNames` (AIS 2022 / AIS 2025) is **cancelled**.
The live entries are **already correct** (Demis Hassabis = AIS 2025, which the 2025 entry
has right); the proposed target had the two years reversed and would have introduced an
error. **No Contentful writes made; both pastEvent entries untouched.** No CMS changes
remain for this pass.

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

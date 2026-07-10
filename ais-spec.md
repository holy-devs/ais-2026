# AIS 2026 — Build Spec (design → CMS mapping)

Athens Innovation Summit 2026 · Endeavor Greece · one-pager
Live: July 16, 2026 · Pnyx, Athens
Site type: single landing page + modals (speaker profiles, past events) + side menu.

## Sources of truth (in this order)
1. THIS file — what the site needs.
2. The live Contentful space — the CURRENT model. **Step 1 of the build is always: export/read the space's existing content types and diff against this spec. Never assume the model; read it.**
3. Figma Build-Handoff file `Mbz2uHWliIy5ta7FrxzKgg`, page `1:22`:
   - section **v5.0** = the final design (desktop `Landing Page - V4.0/ 4`, Mobile frames, Side-menu, Speaker Profile modals, Past Event modals)
   - section **Components** and **Prototypes** = component states + interactions
4. Live prototype https://ais-2026.netlify.app/ — **design tokens live here as CSS variables (HSL with alpha channels)**; also shows all homepage microinteractions. Pull colors/tokens from its stylesheet, not from screenshots.

## Page structure (desktop, top → bottom) and content each section needs

| # | Section (Figma name) | Content requirements |
|---|---------------------|----------------------|
| 0 | Hero | title "ATHENS INNOVATION SUMMIT 2026", location label, 2 CTAs: Get Tickets · Past Editions, hero media (placeholder) |
| 1 | Key-info-strip | key/value pairs: Date → July 16 2026 · Where → Pnyx, Athens (extendable list) |
| 2 | Vision (stats) | heading "Where Athens' Legacy Meets Its Next Chapter", stat counters (Editions, 10,000 Participants Attending, …) |
| 3 | Speakers | speaker cards: name, role/affiliation, portrait (placeholder), one-liner; card opens **Speaker Profile modal**: bio + CTA (View LinkedIn / View Keynote + URL). 2026 confirmed speakers: Kyriakos Mitsotakis (PM, View Keynote), Linda Rottenberg (Endeavor, moderator), Hemant Taneja (General Catalyst), Rafal Modrzewski (ICEYE) — all with LinkedIn CTAs except Mitsotakis (keynote video) |
| 4 | Frame 348 (micro-element) | the keywords micro-element (Legacy · Democracy · Intelligence · Frontier · Prosperity) — likely static/config |
| 5 | Container "Thank you" | heading + paragraph (past-editions gratitude copy) |
| 6 | Gallery "Get Inspired From The Past" | photo grid, Load More behavior, images (placeholders) |
| 7 | Gallery "AIS Archive" | past-events items; each opens **Past Event modal** (title, year, media, description) |
| 8 | Ticket-section | heading, invitation-only copy, request-tickets CTA (form or mailto — check Prototypes) |
| 9 | Partners | "Organisers / Sponsors" logo rows, grouped by tier if design shows tiers |
| 10 | Container (logos) | secondary logo grid (verify against design) |
| 11 | Vision "About Endeavor Greece" | about copy + social links (LINKEDIN, INSTAGRAM) — acts as pre-footer |
| — | Side-menu | nav anchors to sections + Get Tickets CTA |
| — | Menu Container | top nav |

## Content typing guidance (verify against the live model first)
- The space follows the agency base pattern (page / section / uniqueComponent / card / action / richText). Map each landing section to an existing **section variant** where one fits; create new **variant values**, not new types, wherever possible.
- **speaker**: if the space has no person/speaker type, propose one: `internalName, name*, role, affiliation, portrait (Asset), oneLiner, bio, ctaLabel, ctaUrl`. If a person-like type exists, extend it. DECIDE IN THE DIFF STEP, present both options.
- **pastEvent**: archive items with modal → likely entries: `title, year, media[], description`. Same rule: reuse if a fitting type exists.
- Stats, key-info pairs, keywords: prefer JSON config or simple fields on the section entry — do not invent types for 5 values.
- All media = **placeholders** in this build; real assets added manually later. Use clearly named placeholder assets (e.g. `placeholder-speaker.jpg`) so swapping is easy.
- Copy: real text EXISTS in the Figma v5.0 frames — pull it from there verbatim.

## Hard rules
- Enum/variant values: exact Title-Case ASCII strings; the frontend matches them literally.
- No model changes beyond the approved diff. No deletions of existing types/fields.
- Slugs/routing: single page — the landing is one routable entry; modals are NOT routes unless the design's Prototypes say otherwise.
- Every phase ends with a git commit and a STOP for review.

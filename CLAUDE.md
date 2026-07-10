# CLAUDE.md — AIS 2026 build

## Goal
Build the Athens Innovation Summit 2026 one-pager: update the existing Contentful model in the AIS space, create the content entries (placeholder media), update this repo's code to render the v5.0 design, deploy via Vercel.

## Read first, in this order
1. `ais-spec.md` (this repo) — the design → CMS mapping and hard rules.
2. The existing model workspace at `../ais-contentful` — `MAPPING.md`, `migrations/`, `migrations-edits/`, and `holy-master-contentful-brief.md` are the record of the current space model and how it was built. Read these BEFORE exporting.
3. The live Contentful space model (export it and verify it matches the workspace's record; see Workflow step 1).
4. Figma Build-Handoff `Mbz2uHWliIy5ta7FrxzKgg` page `1:22` → section **v5.0** (final design), **Components**, **Prototypes**. Do not read any other Figma file or page.
5. https://ais-2026.netlify.app/ — pull design tokens (CSS variables, HSL/alpha) and microinteraction reference from here.

## Credentials
- `CONTENTFUL_MANAGEMENT_TOKEN` and `CONTENTFUL_SPACE_ID` live in `.env` (never committed, never printed, never echoed in chat or logs).
- If a token is missing, ASK the user to add it to `.env` — do not ask them to paste it in chat.

## Workflow — one phase at a time, STOP after each for approval
1. **Model diff**: export the space's current content types. Compare against `ais-spec.md`. Output a table: exists / needs new variant value / needs new field / needs new type (speaker? pastEvent?). APPLY NOTHING. Stop for review.
2. **Apply model changes**: only the approved diff, via contentful-management. Stop; user verifies in the Contentful UI.
3. **Entries**: create the landing page entry + section entries with the real copy from Figma v5.0, placeholder assets for all media. Stop for review.
4. **Code**: the repo starts empty — scaffold a Next.js (App Router) + TypeScript + Tailwind app with pnpm, wired to Contentful via the delivery API, then build the components to render the design (tokens from the netlify stylesheet, structure from Figma, interactions from Prototypes). Run `dev`; user checks localhost. Stop.
5. **Ship**: commit, push to GitHub, deploy to Vercel. Stop.

## Animations (designer directive)
- Use **GSAP** (npm `gsap` — all plugins incl. SplitText/ScrollTrigger are free) with `@gsap/react` (`useGSAP`).
- Apply **SplitText** to ALL headings and body copy: text-reveal animations on scroll (lines/words), triggered via **ScrollTrigger**.
- Match the microinteractions visible on https://ais-2026.netlify.app/ .
- Client components only where animation is needed; avoid FOUC (set initial hidden state in CSS, not JS); respect `prefers-reduced-motion` by disabling reveals.

## Rules
- Never modify or delete existing content types/fields beyond the approved diff.
- Prefer new variant VALUES over new types; propose, don't assume.
- Title-Case ASCII for all enum/variant values.
- Placeholder media only; clearly named for later manual swap.
- Commit at the end of every phase with a message naming the phase.
- When a terminal permission prompt is pending, wait for the user's answer before printing new questions or instructions — one thing at a time.

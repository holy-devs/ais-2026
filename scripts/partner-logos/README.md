# Partner logos — parked for next cycle

The Organisers/Sponsors section is gated OFF for this cycle
(`SectionRenderer.tsx` → `PARTNERS_ENABLED = false`). This folder keeps the
verified logo work so re-enabling next year is quick.

## ⚠️ The two LIVE Contentful assets are bad — do not reuse
`ph-partner-01` (Google) and `ph-partner-02` (Endeavor) currently hold
**flattened white squares**: an earlier `qlmanage` rasterization baked the
transparent SVGs onto white, so both are 100% opaque white (byte-identical,
invisible on the dark tiles). Replace them before turning the section back on.

## Verified transparent replacements (ready to upload)
- `google.png`, `endeavor.png` — 1200×800, **3:2, real alpha** (~92% / ~97%
  transparent), white logo, distinct files. Verified pixel-wise + on a dark
  composite.

## How they were made (reproduce / regenerate)
- Sources: `google-source.svg`, `endeavor-source.svg` (from Figma v5.0 logo-block
  components).
- `make-logos.mjs` centers each logo on a 3:2 white-fill canvas → `*-3x2.svg`.
- Rasterize with **sharp** (transparency-preserving; NOT qlmanage):
  `sharp(svg,{density:384}).resize(1200,800,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png()`

## Re-enable checklist
1. Obtain official sponsor logos (NBG, Raycap, Eurobank) + confirm Google/Endeavor.
2. Rasterize all to transparent PNG (above).
3. Scoped Contentful file-replace on the SAME asset IDs (`ph-partner-01/02`, …),
   publish. Delivery-verify new bytes (different md5, transparent).
4. Flip `PARTNERS_ENABLED = true`.

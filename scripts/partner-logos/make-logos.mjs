// Build 3:2 white-on-transparent SVGs for Google + Endeavor from the Figma SVGs.
// Endeavor: keep only the wordmark path (drop the off-canvas duplicate). Tight-crop
// each logo via a real path bbox, then center on a 1200x800 (3:2) canvas with padding.
import { readFileSync, writeFileSync } from 'fs';
const DIR = '/private/tmp/claude-503/-Users-Yiannis-dev-ais-2026/56313a17-8e06-43fc-9ac0-8d69da68a2ac/scratchpad/media';

// ---- minimal but correct SVG path bbox (M/L/H/V/C/S/Q/T/A/Z, abs+rel) ----
function pathBBox(d) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0;
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
  const num = () => parseFloat(toks[i++]);
  const ext = (px, py) => { if (px < minx) minx = px; if (px > maxx) maxx = px; if (py < miny) miny = py; if (py > maxy) maxy = py; };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === 'M') { let nx = num(), ny = num(); x = rel ? x + nx : nx; y = rel ? y + ny : ny; sx = x; sy = y; ext(x, y); cmd = rel ? 'l' : 'L'; }
    else if (C === 'L') { let nx = num(), ny = num(); x = rel ? x + nx : nx; y = rel ? y + ny : ny; ext(x, y); }
    else if (C === 'H') { let nx = num(); x = rel ? x + nx : nx; ext(x, y); }
    else if (C === 'V') { let ny = num(); y = rel ? y + ny : ny; ext(x, y); }
    else if (C === 'C') { for (const _ of [0]) { let a = num(), b = num(), c = num(), e = num(), f = num(), g = num(); const p = (dx, dy) => rel ? [x + dx, y + dy] : [dx, dy]; ext(...p(a, b)); ext(...p(c, e)); const [gx, gy] = p(f, g); ext(gx, gy); x = gx; y = gy; } }
    else if (C === 'S' || C === 'Q') { let a = num(), b = num(), c = num(), e = num(); const p = (dx, dy) => rel ? [x + dx, y + dy] : [dx, dy]; ext(...p(a, b)); const [gx, gy] = p(c, e); ext(gx, gy); x = gx; y = gy; }
    else if (C === 'T') { let a = num(), b = num(); const [gx, gy] = rel ? [x + a, y + b] : [a, b]; ext(gx, gy); x = gx; y = gy; }
    else if (C === 'A') { num(); num(); num(); num(); num(); let a = num(), b = num(); const [gx, gy] = rel ? [x + a, y + b] : [a, b]; ext(gx, gy); x = gx; y = gy; }
    else if (C === 'Z') { x = sx; y = sy; }
    else { i++; }
  }
  return { minx, miny, maxx, maxy, w: maxx - minx, h: maxy - miny };
}

function paths(svg) {
  return [...svg.matchAll(/<path\b[^>]*?\/?>/g)].map(m => {
    const full = m[0];
    const d = (full.match(/\bd="([^"]+)"/) || [])[1] || '';
    return { full, d };
  }).filter(p => p.d);
}

// Square canvas (qlmanage outputs square; the 3:2 tile's object-cover trims the
// transparent top/bottom). Logo centered; padY generous so it survives that crop.
function canvas3x2(innerPaths) {
  const CW = 1200, CH = 800, padX = CW * 0.12, padY = CH * 0.22;
  const availW = CW - 2 * padX, availH = CH - 2 * padY;
  // union bbox of the included paths
  let b = { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity };
  for (const p of innerPaths) { const bb = pathBBox(p.d); b.minx = Math.min(b.minx, bb.minx); b.miny = Math.min(b.miny, bb.miny); b.maxx = Math.max(b.maxx, bb.maxx); b.maxy = Math.max(b.maxy, bb.maxy); }
  const w = b.maxx - b.minx, h = b.maxy - b.miny;
  const s = Math.min(availW / w, availH / h);
  const drawW = w * s, drawH = h * s;
  const tx = (CW - drawW) / 2 - b.minx * s;
  const ty = (CH - drawH) / 2 - b.miny * s;
  const body = innerPaths.map(p => p.full.replace(/fill="[^"]*"/g, 'fill="#ffffff"')).join('\n    ') ;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CW} ${CH}" width="${CW}" height="${CH}">\n  <g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(5)})">\n    ${body}\n  </g>\n</svg>\n`, bbox: b };
}

// Google — single path
const g = readFileSync(`${DIR}/logo_vector.svg`, 'utf8');
const gp = paths(g);
const gc = canvas3x2([gp[0]]);
writeFileSync(`${DIR}/google_3x2.svg`, gc.svg);
console.log('google paths:', gp.length, 'bbox:', gc.bbox);

// Endeavor — pick the wordmark path = the one with the WIDEST aspect (w/h) near ~5:1;
// the duplicate spans the same width but a taller union, so compare per-path.
const e = readFileSync(`${DIR}/endeavor_raster.png`, 'utf8'); // (actually an SVG)
const ep = paths(e);
const info = ep.map((p, idx) => { const bb = pathBBox(p.d); return { idx, bb, aspect: bb.w / bb.h }; });
info.forEach(o => console.log(`  endeavor path${o.idx}: w=${o.bb.w.toFixed(1)} h=${o.bb.h.toFixed(1)} aspect=${o.aspect.toFixed(2)} y[${o.bb.miny.toFixed(1)}..${o.bb.maxy.toFixed(1)}]`));
// wordmark = highest aspect ratio (widest & shortest)
const word = info.slice().sort((a, b) => b.aspect - a.aspect)[0];
const ec = canvas3x2([ep[word.idx]]);
writeFileSync(`${DIR}/endeavor_3x2.svg`, ec.svg);
console.log('endeavor wordmark = path', word.idx, 'bbox:', ec.bbox);

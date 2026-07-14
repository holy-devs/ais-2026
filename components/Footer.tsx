import { f } from '@/lib/map';
import { CornerMarks } from './Crosshair';
import { GlassButton } from './Buttons';
import { SendIcon } from './Icons';

interface NavItem { label: string; anchor: string }

function Column({ title, items }: { title: string; items: { label: string; href: string; external?: boolean }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 text-left">
      <p className="text-xs text-creme">{title}</p>
      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              {...(it.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-xs text-white transition hover:text-creme"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Footer, driven by the uniqueComponent (variant Footer) json; the Navigation column
// reuses the CMS menu nav passed from the page (read-only, ruling #4).
export default function Footer({ entry, nav = [], ticketsEnabled = true }: { entry: any; nav?: NavItem[]; ticketsEnabled?: boolean }) {
  const x = f(entry);
  const json = x.json || {};
  const socials: { label: string; url: string }[] = Array.isArray(json.socials) ? json.socials : [];
  const prev: { label: string; anchor: string }[] = Array.isArray(json.previousEditions) ? json.previousEditions : [];
  const crafted: string = json.craftedBy || '';
  const craftedParts = crafted.includes('HØLY') ? crafted.split('HØLY') : null;

  return (
    <footer className="relative overflow-hidden bg-e1 section-y px-6 md:px-9">
      {/* v5.0 grid lines + corner crosshairs */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0"
        style={{ ['--grid-gap' as string]: '180px' }}
      />
      {/* M1: identical to the hero crosshairs — same CornerMarks component, same
          props (size 9, z-30) per the designer's "exact same as hero" instruction. */}
      <CornerMarks inset={24} size={9} className="z-30 text-white/60" />

      <div className="relative mx-auto flex w-full max-w-content flex-col items-center">
        {/* Display block — hardcoded design copy (not in the CMS; see OPEN.md) */}
        <div className="text-center">
          {/* Display: Founders Grotesk Medium 164px / lh 73 / tracking -9px (per brief).
              Client hotfix: keep Figma tracking (-0.055em) but add word-spacing so the
              three words stay separated at display size, + looser leading so "Loop"
              unsticks below (and self-overlap is avoided if it wraps on mobile). */}
          <div className="font-grotesk font-medium uppercase leading-[0.9] tracking-[-0.055em] [word-spacing:0.15em] text-white text-[clamp(2.75rem,13vw,10.25rem)]">
            Stay in the
          </div>
          {/* PP Editorial Old Italic 124px. A4: uppercase (LOOP) — case-only, per designer. */}
          <div className="font-editorial italic uppercase leading-[0.62] tracking-[-0.055em] text-creme text-[clamp(2.25rem,9.7vw,7.75rem)]">
            Loop
          </div>
        </div>

        {/* Subscribe — input fills E3 on hover/focus (review B10). */}
        {json.subscribe && (
          <div className="mt-10 flex w-full max-w-md items-stretch gap-1">
            <div className="flex flex-1 border border-rule bg-e2 transition-colors hover:bg-e3 focus-within:bg-e3">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/45"
              />
            </div>
            <GlassButton centered label={json.subscribe.label || 'Subscribe'} icon={<SendIcon />} />
          </div>
        )}

        {/* Link columns — M6: one horizontal row on mobile too (no wrap/stack);
            tighter gap on small screens so all three columns fit at 390px. */}
        <div className="mt-16 flex items-start justify-center gap-x-6 md:gap-x-10">
          <Column
            title="Navigation"
            items={nav
              // Drop Program to match the header nav (F1 — #program anchor removed);
              // drop Request Tickets (→ #ticket-section) when tickets are off.
              .filter(
                (n) =>
                  n.anchor !== '#program' &&
                  !/^program$/i.test(n.label.trim()) &&
                  (ticketsEnabled || n.anchor !== '#ticket-section'),
              )
              .map((n) => ({ label: n.label, href: n.anchor }))}
          />
          <Column title="Previous Editions" items={prev.map((p) => ({ label: p.label, href: p.anchor }))} />
          <Column
            title="Social"
            items={socials.filter((s) => s.url).map((s) => ({ label: s.label, href: s.url, external: true }))}
          />
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
          <span className="text-white/70">{json.copyright}</span>
          {craftedParts ? (
            <span className="text-white">
              {craftedParts[0]}
              <a href="https://www.holy.gd" target="_blank" rel="noreferrer" className="text-creme transition hover:opacity-80">
                HØLY
              </a>
              {craftedParts[1]}
            </span>
          ) : (
            <span className="text-white">{crafted}</span>
          )}
        </div>
      </div>
    </footer>
  );
}

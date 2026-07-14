'use client';

import { useEffect, useState } from 'react';
import { CornerMarks } from './Crosshair';
import { SendIcon } from './Icons';
import { GlassButton } from './Buttons';

interface NavItem { label: string; anchor: string }
interface Cta { label: string; anchor: string }

// Present CMS labels in the design's Title Case regardless of stored casing (review B1).
const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

export default function Nav({ nav, cta, ticketsEnabled = true }: { nav: NavItem[]; cta?: Cta; ticketsEnabled?: boolean }) {
  // Drop the orphaned Program item + #program anchor (F1: no Program section this cycle).
  // When tickets are off, also drop the Request Tickets nav link (→ #ticket-section)
  // so it isn't a dead link once the ticket section is hidden.
  const items = nav.filter(
    (n) =>
      n.anchor !== '#program' &&
      !/^program$/i.test(n.label.trim()) &&
      (ticketsEnabled || n.anchor !== '#ticket-section'),
  );
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Hysteresis (snap down at 20px, unsnap up at 5px) — prevents flicker at the
    // threshold since the top snap is instant (no transition to damp a single edge).
    const onScroll = () => setScrolled((prev) => (prev ? window.scrollY > 5 : window.scrollY > 20));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // Close the side menu on Escape (parity with the modals).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-40 transition-colors duration-300 ${
          scrolled
            ? 'top-0 border-b border-rule bg-page/85 backdrop-blur' // scrolled: snaps to compact top-0 bar
            : 'top-[10vh] bg-transparent' // hero state: 10vh down, transparent, inside the crosshair frame
        }`}
      >
        <div className="mx-auto flex w-full max-w-content items-center justify-between px-6 py-4 md:px-9">
          <a
            href="#top"
            className="text-xs font-medium uppercase tracking-[0.12em] text-white md:text-sm"
          >
            Athens Innovation Summit
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {items.map((n) => (
              <a key={n.label} href={n.anchor} className="text-sm tracking-[-0.01em] text-white/80 transition hover:text-creme">
                {titleCase(n.label)}
              </a>
            ))}
            {cta && <GlassButton href={cta.anchor} label={cta.label} icon={<SendIcon size={14} />} />}
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center border-b border-white/40 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/25 md:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Full-screen side menu (Side-menu.png) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        {/* Glass fill: #010010 @ 70% + frosted backdrop (review D3, refraction/frost
            approximated via CSS; blur is mobile-reduced to avoid full-screen jank). */}
        <div className="absolute inset-0 bg-page/70 backdrop-blur-md backdrop-saturate-150 md:backdrop-blur-2xl" />
        <div className="relative flex h-full flex-col px-6 py-6">
          <div className="flex justify-end">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center border-b border-white/40 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2">
            {items.map((n) => (
              <a
                key={n.label}
                href={n.anchor}
                onClick={() => setOpen(false)}
                className="w-fit font-grotesk text-4xl text-white underline-offset-8 transition hover:text-creme hover:underline md:text-5xl"
              >
                {titleCase(n.label)}
              </a>
            ))}
          </nav>

          {cta && (
            <GlassButton
              fullWidth
              href={cta.anchor}
              onClick={() => setOpen(false)}
              label={cta.label}
              icon={<SendIcon />}
            />
          )}
        </div>
      </div>
    </>
  );
}

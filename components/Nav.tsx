'use client';

import { useEffect, useState } from 'react';
import { CornerMarks } from './Crosshair';
import { SendIcon } from './Icons';

interface NavItem { label: string; anchor: string }
interface Cta { label: string; anchor: string }

export default function Nav({ nav, cta }: { nav: NavItem[]; cta?: Cta }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? 'border-b border-rule bg-page/85 backdrop-blur' : 'bg-transparent'
        }`}
      >
        {/* Persistent top-corner crosshairs (align with the hero viewport corners). */}
        <CornerMarks corners={['tl', 'tr']} inset={36} size={9} className="text-white/60" />

        <div className="mx-auto flex w-full max-w-content items-center justify-between px-6 py-4 md:px-9">
          <a
            href="#top"
            className="text-xs font-medium uppercase tracking-[0.12em] text-white md:text-sm"
          >
            Athens Innovation Summit
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <a key={n.label} href={n.anchor} className="text-xs uppercase tracking-[0.12em] text-white/80 transition hover:text-creme">
                {n.label}
              </a>
            ))}
            {cta && (
              <a href={cta.anchor} className="inline-flex items-center gap-2 bg-creme px-4 py-2 text-xs font-medium text-page transition hover:opacity-90">
                {cta.label}
                <SendIcon size={14} />
              </a>
            )}
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center bg-white text-page md:hidden"
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
        <div className="absolute inset-0 bg-gradient-to-br from-page via-page to-e1" />
        <div className="relative flex h-full flex-col px-6 py-6">
          <div className="flex justify-end">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center bg-white text-page transition hover:opacity-90"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.anchor}
                onClick={() => setOpen(false)}
                className="w-fit font-grotesk text-4xl text-white underline-offset-8 transition hover:text-creme hover:underline md:text-5xl"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {cta && (
            <a
              href={cta.anchor}
              onClick={() => setOpen(false)}
              className="flex items-stretch bg-white text-page transition hover:opacity-90"
            >
              <span className="flex-1 py-3.5 text-center text-sm font-medium">{cta.label}</span>
              <span className="my-2 border-l border-dashed border-page/30" />
              <span className="flex items-center px-4"><SendIcon /></span>
            </a>
          )}
        </div>
      </div>
    </>
  );
}

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? 'border-b border-rule bg-page/85 backdrop-blur' : 'bg-transparent'
        }`}
      >
        {/* Persistent top-corner crosshairs (align with the hero viewport corners). */}
        <CornerMarks corners={['tl', 'tr']} inset={36} size={9} className="text-white/60" />

        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 md:px-9">
          <a
            href="#top"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-white md:text-sm"
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
            className="flex h-8 w-8 items-center justify-center text-white md:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Side menu */}
      <div
        className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-72 border-l border-rule bg-e1 p-8 transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-mid hover:text-creme">✕</button>
          </div>
          <nav className="flex flex-col gap-5">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.anchor}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.12em] text-hi transition hover:text-creme"
              >
                {n.label}
              </a>
            ))}
            {cta && (
              <a
                href={cta.anchor}
                onClick={() => setOpen(false)}
                className="mt-4 bg-creme px-4 py-3 text-center text-sm font-medium text-page"
              >
                {cta.label}
              </a>
            )}
          </nav>
        </aside>
      </div>
    </>
  );
}

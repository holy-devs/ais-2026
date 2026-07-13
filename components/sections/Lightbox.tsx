'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { MediaDTO } from '@/lib/map';

// Thin-line horizontal arrow (line + arrowhead), matching the sketch's nav arrows.
function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="square" aria-hidden="true">
      {dir === 'left' ? (
        <>
          <line x1="25" y1="14" x2="3" y2="14" />
          <polyline points="11,6 3,14 11,22" />
        </>
      ) : (
        <>
          <line x1="3" y1="14" x2="25" y2="14" />
          <polyline points="17,6 25,14 17,22" />
        </>
      )}
    </svg>
  );
}

// Thin-line close ✕.
function CloseX() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="square" aria-hidden="true">
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  );
}

/**
 * Full-viewport gallery lightbox (designer spec, node 2429-16209). Overlay is
 * #161524 @ 85% with a 30px page blur behind (mobile-reduced to avoid jank); the
 * image is object-contain, centered, never upscaled past its natural size. Close
 * (✕), prev/next arrows (loop), Esc / click-outside / ←→, focus trap, body-scroll
 * lock. Fade in/out, disabled under prefers-reduced-motion. No deps.
 *
 * Kept always-mounted and toggled via `open` so the fade plays in both directions;
 * focus restore to the triggering thumbnail is handled by the parent.
 */
export default function Lightbox({
  images,
  open,
  index,
  onClose,
  onIndex,
}: {
  images: MediaDTO[];
  open: boolean;
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex],
  );
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex],
  );

  // Body-scroll lock + initial focus while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Keyboard: Esc closes, ←/→ step, Tab is trapped inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, prev, next]);

  const img = images[index];
  const many = images.length > 1;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
      aria-hidden={!open}
      onClick={(e) => {
        // Click on the backdrop (outside the image) closes.
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#161524D9] backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none md:backdrop-blur-[30px] ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Close — thin-line ✕, top-right edge */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center text-white/80 transition hover:text-white"
      >
        <CloseX />
      </button>

      {/* Prev / Next (loop) — thin-line arrows on either edge */}
      {many && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/80 transition hover:text-white md:left-6"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/80 transition hover:text-white md:right-6"
          >
            <Arrow dir="right" />
          </button>
        </>
      )}

      {/* Image — contain, centered, breathing room, never upscaled past natural size */}
      {open && img?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.url}
          alt={img.label}
          className="max-h-[85vh] max-w-[90vw] object-contain"
        />
      )}

      {/* Position counter — current/total, centered at the bottom (sketch). */}
      {images.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center text-sm tracking-wide text-white/80">
          {index + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

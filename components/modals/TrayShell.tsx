'use client';

import type { ReactNode } from 'react';

// Thin-line close ✕ (matches the lightbox nav glyphs).
function CloseX() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="square" aria-hidden="true">
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  );
}

// Section eyebrow ("• Label") shared across tray sections.
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mid">
      <span className="text-creme">•</span>
      {children}
    </h4>
  );
}

/**
 * Side-tray shell (review C1): 800px wide, inset ≥24px from every page edge, dark
 * blurred overlay behind (mobile-reduced blur), floating ✕ with an E3 fill. Content
 * scrolls; ≥24px internal padding.
 */
export default function TrayShell({
  onClose,
  label,
  children,
}: {
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md md:backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="relative m-6 flex h-[calc(100%-3rem)] w-full max-w-[800px] flex-col overflow-hidden bg-e1 shadow-2xl"
      >
        {/* Close — E3 fill, top-right (review C1) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center bg-e3 text-white/80 transition hover:text-white"
        >
          <CloseX />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

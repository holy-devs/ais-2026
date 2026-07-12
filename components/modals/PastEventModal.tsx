'use client';

import type { PastEventDTO } from '@/lib/map';
import Media from '../Media';

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 19 3 12l7-7" />
      <path d="M3 12h18" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PastEventModal({ data, onClose }: { data: PastEventDTO; onClose: () => void }) {
  const date = formatDate(data.dateTime);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-e1 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-e1/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={onClose} aria-label="Back" className="text-white/70 transition hover:text-creme"><BackIcon /></button>
            <span className="text-base text-white">{data.editionLabel || 'Past Event'}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-rule text-white/70 transition hover:text-creme"
          >
            ✕
          </button>
        </header>

        <div className="px-5 py-6">
          {/* Hero with title + meta overlay */}
          <div className="relative">
            <Media media={data.hero} rounded={false} className="aspect-[4/3] w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-page/85 via-page/20 to-transparent" />
            <div className="absolute inset-x-5 bottom-5">
              <h3 className="text-3xl font-medium leading-tight text-white">{data.title}</h3>
              {(data.location || date) && (
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/85">
                  {data.location && <span className="inline-flex items-center gap-1.5"><PinIcon />{data.location}</span>}
                  {date && <span className="inline-flex items-center gap-1.5"><CalIcon />{date}</span>}
                </div>
              )}
            </div>
          </div>

          {data.description && <p className="mt-6 text-sm leading-relaxed text-hi">{data.description}</p>}

          {/* Gallery — renders only if the entry populates the gallery field (ours don't yet). */}
          {data.gallery.length > 0 && (
            <section className="mt-8">
              <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mid"><span className="text-creme">•</span>Visuals</h4>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {data.gallery.map((g, i) => (
                  <Media key={i} media={g} rounded={false} className="aspect-square w-full" />
                ))}
              </div>
            </section>
          )}

          {/* Speakers — the model stores names (strings), not linked people, so this is a
              simple list rather than the ref's portrait cards. See OPEN.md. */}
          {data.speakerNames.length > 0 && (
            <section className="mt-8">
              <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mid"><span className="text-creme">•</span>Speakers</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {data.speakerNames.map((n) => (
                  <li key={n} className="border border-rule bg-e2 px-3 py-1.5 text-xs text-hi">{n}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

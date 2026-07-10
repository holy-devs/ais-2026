'use client';

import type { PastEventDTO } from '@/lib/map';
import Media from '../Media';

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PastEventModal({ data, onClose }: { data: PastEventDTO; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-e1 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-e1/95 px-6 py-4 backdrop-blur">
          <span className="text-xs uppercase tracking-[0.2em] text-mid">{data.editionLabel || 'Past Event'}</span>
          <button onClick={onClose} aria-label="Close" className="text-mid transition hover:text-creme">✕</button>
        </header>

        <div className="px-6 py-6">
          <div className="relative">
            <Media media={data.hero} className="aspect-[4/3] w-full" />
            <h3 className="pointer-events-none absolute inset-x-4 bottom-4 font-serif text-3xl italic text-white drop-shadow">
              {data.title}
            </h3>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            {data.location && (
              <div className="flex gap-2 text-hi"><dt className="text-mid">◎</dt><dd>{data.location}</dd></div>
            )}
            {formatDate(data.dateTime) && (
              <div className="flex gap-2 text-hi"><dt className="text-mid">▤</dt><dd>{formatDate(data.dateTime)}</dd></div>
            )}
          </dl>

          {data.description && <p className="mt-5 text-sm leading-relaxed text-hi">{data.description}</p>}

          {data.gallery.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              {data.gallery.map((g, i) => (
                <Media key={i} media={g} className="aspect-square w-full" />
              ))}
            </div>
          )}

          {data.speakerNames.length > 0 && (
            <section className="mt-8">
              <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-mid">Speakers</h4>
              <ul className="flex flex-wrap gap-2">
                {data.speakerNames.map((n) => (
                  <li key={n} className="border border-rule bg-e2 px-3 py-1 text-xs text-hi">{n}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

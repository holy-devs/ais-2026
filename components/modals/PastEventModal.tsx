'use client';

import { useState } from 'react';
import type { PastEventDTO } from '@/lib/map';
import Media from '../Media';
import TrayShell, { Eyebrow } from './TrayShell';
import { GlassButton } from '../Buttons';

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
  const [visualsShown, setVisualsShown] = useState(4);
  const visuals = data.gallery.slice(0, visualsShown);

  // Video/documentary + keynote/program sections (review C3) have no field on the
  // pastEvent model yet, so they're omitted rather than faked — logged in OPEN.md.

  return (
    <TrayShell onClose={onClose} label={`${data.editionLabel || data.title} — past event`}>
      {/* Mosaic hero with title + location + date overlay */}
      <div className="relative pr-12">
        <Media media={data.hero} rounded={false} className="aspect-[16/10] w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-page/85 via-page/20 to-transparent" />
        <div className="absolute inset-x-6 bottom-5">
          <h3 className="text-3xl font-medium leading-tight text-white md:text-4xl">{data.title}</h3>
          {(data.location || date) && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/85">
              {data.location && <span className="inline-flex items-center gap-1.5"><PinIcon />{data.location}</span>}
              {date && <span className="inline-flex items-center gap-1.5"><CalIcon />{date}</span>}
            </div>
          )}
        </div>
      </div>

      {data.description && <p className="mt-6 text-lg leading-relaxed text-hi">{data.description}</p>}

      {/* Speakers — model stores names (strings), not linked people, so cards show the
          name only (portrait/bio unavailable). Link to person entries to enrich (OPEN.md). */}
      {data.speakerNames.length > 0 && (
        <section className="mt-10">
          <Eyebrow>Speakers</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {data.speakerNames.map((n) => (
              <div key={n} className="border border-rule bg-e2 px-4 py-4 text-sm font-medium text-white">
                {n}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visuals — 2-column gallery + Load More (renders only if the entry populates it) */}
      {data.gallery.length > 0 && (
        <section className="mt-10">
          <Eyebrow>Visuals</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {visuals.map((g, i) => (
              <Media key={i} media={g} rounded={false} className="aspect-square w-full" />
            ))}
          </div>
          {visualsShown < data.gallery.length && (
            <div className="mt-3">
              <GlassButton onClick={() => setVisualsShown((n) => n + 4)} label="Load More" />
            </div>
          )}
        </section>
      )}
    </TrayShell>
  );
}

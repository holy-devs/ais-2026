'use client';

import type { SpeakerDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import Media from '../Media';

// Adaptive columns: 4-up on desktop for exactly 4 speakers, otherwise 3-up (3/6/…),
// so the grid stays symmetric regardless of how many speakers the CMS holds.
function gridCols(n: number): string {
  if (n === 4) return 'sm:grid-cols-2 lg:grid-cols-4';
  if (n % 3 === 0) return 'sm:grid-cols-2 lg:grid-cols-3';
  if (n % 2 === 0) return 'sm:grid-cols-2 lg:grid-cols-4';
  return 'sm:grid-cols-2 lg:grid-cols-3';
}

export default function SpeakersClient({ speakers }: { speakers: SpeakerDTO[] }) {
  const { openSpeaker } = useModal();

  return (
    <div className={`grid gap-6 ${gridCols(speakers.length)}`}>
      {speakers.map((s) => (
        <button
          key={s.id}
          onClick={() => openSpeaker(s)}
          className="group text-left"
          data-reveal="words"
        >
          <Media media={s.portrait} className="aspect-[4/5] w-full transition group-hover:opacity-90" />
          <h3 className="mt-4 text-xl font-medium text-white">{s.name}</h3>
          {s.role && <p className="mt-1 text-sm text-mid">{s.role}</p>}
          {s.oneLiner && s.oneLiner !== s.role && <p className="mt-1 text-xs text-low">{s.oneLiner}</p>}
          <span className="mt-3 inline-block text-xs uppercase tracking-[0.15em] text-creme opacity-0 transition group-hover:opacity-100">
            {s.ctaLabel} ↗
          </span>
        </button>
      ))}
    </div>
  );
}

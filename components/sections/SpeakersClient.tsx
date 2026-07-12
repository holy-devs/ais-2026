'use client';

import type { SpeakerDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import Media from '../Media';
import { CornerMarks } from '../Crosshair';

// 4-up on desktop for exactly 4 speakers, otherwise 3-up.
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
          className="group relative flex flex-col border border-white/10 text-left"
          data-reveal="words"
        >
          <CornerMarks inset={0} size={9} className="text-white/50" />
          {/* B&W by default on desktop, color on hover; color-direct on mobile (no hover). */}
          <Media
            media={s.portrait}
            rounded={false}
            className="aspect-[4/5] w-full transition duration-500 md:grayscale md:group-hover:grayscale-0"
          />
          <div className="flex flex-1 items-end justify-between gap-3 p-4">
            <div>
              <h3 className="text-lg font-medium text-white">{s.name}</h3>
              {s.role && <p className="mt-1 text-sm text-mid">{s.role}</p>}
              {s.oneLiner && s.oneLiner !== s.role && <p className="mt-1 text-xs text-low">{s.oneLiner}</p>}
            </div>
            <span className="shrink-0 whitespace-nowrap text-xs uppercase tracking-[0.15em] text-creme">
              {s.ctaLabel}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

'use client';

import type { SpeakerDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import Media from '../Media';
import { Crosshair } from '../Crosshair';

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
          {/* Top-corner crosshairs that spin with the B&W→color hover (review B4). */}
          <span className="pointer-events-none absolute left-0 top-0 z-10 text-white/50 transition-transform duration-500 group-hover:rotate-45">
            <Crosshair size={9} />
          </span>
          <span className="pointer-events-none absolute right-0 top-0 z-10 text-white/50 transition-transform duration-500 group-hover:rotate-45">
            <Crosshair size={9} />
          </span>
          {/* B&W by default on desktop, color on hover; color-direct on mobile (no hover). */}
          <Media
            media={s.portrait}
            rounded={false}
            className="aspect-[4/5] w-full transition duration-500 md:grayscale md:group-hover:grayscale-0"
          />
          <div className="flex flex-1 items-end justify-between gap-3 p-5">
            <div>
              <h3 className="text-lg font-medium text-white">{s.name}</h3>
              {/* Role: 16/18 Founders Regular, full white, ls 0 (Figma Final UI 2026). */}
              {s.role && <p className="mt-1 text-base leading-[18px] tracking-normal text-white">{s.role}</p>}
              {/* Detail: 14/14, ls -2%, white @ 70% — muted look is intended, keep 70%. */}
              {s.oneLiner && s.oneLiner !== s.role && (
                <p className="mt-1 text-sm leading-[14px] tracking-[-0.02em] text-white/70">{s.oneLiner}</p>
              )}
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

'use client';

import type { SpeakerDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import { SpeakerCard } from '../SpeakerCard';

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
        <SpeakerCard
          key={s.id}
          reveal
          onClick={() => openSpeaker(s)}
          data={{ photo: s.portrait, name: s.name, role: s.role, detail: s.oneLiner, ctaLabel: s.ctaLabel, ctaUrl: s.ctaUrl }}
        />
      ))}
    </div>
  );
}

'use client';

import type { PastEventDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import Media from '../Media';

export default function ArchiveClient({ events }: { events: PastEventDTO[] }) {
  const { openPastEvent } = useModal();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {events.map((e) => (
        <button
          key={e.id}
          onClick={() => openPastEvent(e)}
          className="group relative overflow-hidden text-left"
          data-reveal="words"
        >
          <Media media={e.hero} className="aspect-[16/10] w-full transition group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-page/90 to-transparent" />
          <div className="absolute inset-x-5 bottom-5">
            <p className="text-xs uppercase tracking-[0.2em] text-creme">{e.editionLabel}</p>
            <h3 className="mt-1 font-serif text-2xl italic text-white">{e.title}</h3>
          </div>
        </button>
      ))}
    </div>
  );
}

'use client';

import type { PastEventDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import Media from '../Media';
import { ArrowUpRight } from '../Icons';

export default function ArchiveClient({ events }: { events: PastEventDTO[] }) {
  const { openPastEvent } = useModal();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {events.map((e) => (
        <div key={e.id} className="flex flex-col" data-reveal="words">
          <button
            onClick={() => openPastEvent(e)}
            className="group block overflow-hidden text-left"
            aria-label={`Open ${e.editionLabel || e.title}`}
          >
            <Media media={e.hero} rounded={false} className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.02]" />
          </button>

          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-2xl text-white md:text-3xl">{e.editionLabel || e.title}</h3>
              {e.speakerNames.length > 0 && (
                <p className="mt-2 max-w-md text-xs leading-relaxed text-mid">{e.speakerNames.join(', ')}</p>
              )}
            </div>
            <button
              onClick={() => openPastEvent(e)}
              className="inline-flex shrink-0 items-stretch bg-white text-page transition hover:opacity-90"
            >
              <span className="px-4 py-2.5 text-sm font-medium">Visit Archive</span>
              <span className="my-1.5 border-l border-dashed border-page/30" />
              <span className="flex items-center px-3"><ArrowUpRight /></span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

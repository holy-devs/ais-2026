'use client';

import type { PastEventDTO } from '@/lib/map';
import { useModal } from '../modals/ModalProvider';
import Media from '../Media';
import { ArrowUpRight } from '../Icons';
import { GlassButton } from '../Buttons';

export default function ArchiveClient({ events }: { events: PastEventDTO[] }) {
  const { openPastEvent } = useModal();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {events.map((e) => (
        <div
          key={e.id}
          className="group flex flex-col bg-e2 p-4 transition-colors duration-300 hover:bg-e3"
          data-reveal="words"
        >
          <button
            onClick={() => openPastEvent(e)}
            className="block overflow-hidden text-left"
            aria-label={`Open ${e.editionLabel || e.title}`}
          >
            <Media media={e.hero} rounded={false} className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.02]" />
          </button>

          {/* Title + speakers up top, Visit Archive pinned to the card bottom. */}
          <div className="mt-5 flex flex-1 flex-col">
            <h3 className="text-2xl text-white md:text-3xl">{e.editionLabel || e.title}</h3>
            {/* Speaker names: 16/18 Founders Regular, full white, ls 0 (Figma Final UI 2026). */}
            {e.speakerNames.length > 0 && (
              <p className="mt-2 max-w-md text-base leading-[18px] tracking-normal text-white">{e.speakerNames.join(', ')}</p>
            )}
            <div className="mt-auto pt-6">
              <GlassButton onClick={() => openPastEvent(e)} label="Visit Archive" icon={<ArrowUpRight />} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

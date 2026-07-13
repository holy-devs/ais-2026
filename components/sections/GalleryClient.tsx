'use client';

import { useRef, useState } from 'react';
import type { MediaDTO } from '@/lib/map';
import Media from '../Media';
import { GlassButton } from '../Buttons';
import Lightbox from './Lightbox';

const INITIAL = 8; // matches the design: 8 visible, then a Load More button
const STEP = 4;

export default function GalleryClient({ images }: { images: MediaDTO[] }) {
  const [count, setCount] = useState(Math.min(INITIAL, images.length));
  const visible = images.slice(0, count);
  const hasMore = count < images.length;

  // Lightbox state — index into the FULL images array; trigger element for focus restore.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openAt = (i: number, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setOpenIndex(i);
  };
  const close = () => {
    setOpenIndex(null);
    // Restore focus to the thumbnail that opened the viewer.
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  return (
    <>
      <div className="relative">
        {/* Framed tiles: 10px inner padding + hairline border, 10px gutters (review B5). */}
        <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
          {visible.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              aria-label={`View image ${i + 1}`}
              className="group block border border-rule p-[10px] transition-colors hover:border-creme/40"
            >
              <Media
                media={img}
                rounded={false}
                className="aspect-[4/3] w-full transition duration-500 group-hover:opacity-90"
              />
            </button>
          ))}
        </div>

        {/* Blur teaser over the bottom of the grid, with Load More sitting on it. */}
        {hasMore && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-page via-page/85 to-transparent backdrop-blur-md md:backdrop-blur-2xl"
            />
            <div className="absolute inset-x-0 bottom-5 flex justify-center">
              <GlassButton onClick={() => setCount((c) => Math.min(c + STEP, images.length))} label="Load More" />
            </div>
          </>
        )}
      </div>

      <Lightbox
        images={images}
        open={openIndex !== null}
        index={openIndex ?? 0}
        onClose={close}
        onIndex={setOpenIndex}
      />
    </>
  );
}

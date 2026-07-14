'use client';

import { useRef, useState } from 'react';
import type { MediaDTO } from '@/lib/map';
import { GlassButton } from '../Buttons';
import { GalleryTile } from '../modals/GalleryTile';
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
      <div>
        {/* Full sidetray treatment (A6c): shared GalleryTile — 5:7 portrait, creme
            0.5px border, 4px padding, gap-0, #cde0e3 empty fallback. Clickable →
            opens the lightbox (unchanged). */}
        <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
          {visible.map((img, i) => (
            <GalleryTile
              key={i}
              media={img}
              ariaLabel={`View image ${i + 1}`}
              onClick={(e) => openAt(i, e.currentTarget)}
            />
          ))}
        </div>

        {/* Load More — below the grid, normal flow (blur teaser removed, wave2 A3). */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <GlassButton onClick={() => setCount((c) => Math.min(c + STEP, images.length))} label="Load More" />
          </div>
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

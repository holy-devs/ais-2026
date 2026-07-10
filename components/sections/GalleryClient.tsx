'use client';

import { useState } from 'react';
import type { MediaDTO } from '@/lib/map';
import Media from '../Media';

const INITIAL = 8; // matches the design: 8 visible, then a Load More button
const STEP = 4;

export default function GalleryClient({ images }: { images: MediaDTO[] }) {
  const [count, setCount] = useState(Math.min(INITIAL, images.length));
  const visible = images.slice(0, count);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {visible.map((img, i) => (
          <Media key={i} media={img} className="aspect-[4/3] w-full" />
        ))}
      </div>

      {count < images.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setCount((c) => Math.min(c + STEP, images.length))}
            className="border border-creme/40 px-6 py-3 text-sm uppercase tracking-[0.15em] text-creme transition hover:bg-creme hover:text-page"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}

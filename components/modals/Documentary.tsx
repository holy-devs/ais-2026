'use client';

import { useState } from 'react';
import type { MediaDTO } from '@/lib/map';
import Media from '../Media';
import { youTubeId, youTubeThumb, youTubeThumbFallback, youTubeEmbed } from '@/lib/youtube';

// ~56px play button (node 9-6651), matching the modal's original PlayIcon.
function PlayIcon() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors duration-300 group-hover:bg-white/25" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-white"><path d="M6 4l14 8-14 8z" /></svg>
    </span>
  );
}

// Documentary block. Navy 4px frame + 8px radius (node 9-6689).
// - No video URL  → rest state EXACTLY as before: 3:4 poster (documentaryMedia) or
//   the #2e405d empty block. No play control (never a dead button).
// - Video URL     → 3:4 poster + play affordance; on click the frame deliberately
//   expands 3:4 → 16:9 and mounts the youtube-nocookie iframe (created only after
//   the click — lazy).
//
// The aspect morph animates padding-bottom (the classic ratio hack: 3:4 → 133.333%,
// 16:9 → 56.25%) rather than `aspect-ratio`, which does not transition reliably in
// browsers. Content is absolutely positioned inside the padded box.
export function Documentary({ media, videoUrl }: { media: MediaDTO; videoUrl?: string }) {
  const id = youTubeId(videoUrl);
  const [playing, setPlaying] = useState(false);
  const frame = 'border-4 border-[#1e1d33] rounded-[8px] overflow-hidden';

  // No playable video → keep the block untouched (D2-(b): rest state unchanged).
  if (!id) {
    if (media?.url) return <Media media={media} rounded={false} className={`w-full aspect-[3/4] ${frame}`} />;
    return <div className={`relative w-full aspect-[3/4] bg-[#2e405d] ${frame}`} role="img" aria-label="placeholder" />;
  }

  return (
    <div
      className={`relative w-full ${frame} transition-[padding] duration-500 ease-out motion-reduce:transition-none`}
      style={{ paddingBottom: playing ? '56.25%' : '133.333%' }}
    >
      {playing ? (
        <iframe
          src={youTubeEmbed(id)}
          title="Documentary"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play documentary"
          className="group absolute inset-0 h-full w-full"
        >
          {/* Poster: documentaryMedia if set, else the YT thumbnail center-cropped to 3:4
              (maxres → hqdefault fallback so widescreen posters don't show black bars). */}
          {media?.url ? (
            <Media media={media} rounded={false} className="h-full w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={youTubeThumb(id)}
              onError={(e) => { e.currentTarget.src = youTubeThumbFallback(id); }}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/20">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
}

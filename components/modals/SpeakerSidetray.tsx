'use client';

import { useState } from 'react';
import type { PastEventSpeakerDTO, MediaDTO, PressDTO } from '@/lib/map';
import Media from '../Media';
import { Eyebrow } from './eyebrow';
import { PressCard } from './PressCard';
import { ArrowUpRight } from '../Icons';

/*
 * P5.7 STRUCTURE ONLY — spacing/size/aspect values marked TODO(figma) are provisional
 * pending exact values from node 9-6786. Speaker Profile sidetray: 800px mid-width,
 * hero (photo + name[creme]/designation[white] bottom-aligned + CTA) → ABOUT → VISUALS
 * (edition gallery) → PRESS. Eyebrow headings throughout; grey blocks for unset media.
 */

function CloseX() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="square" aria-hidden="true">
      <line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  );
}

// Image if set, else a clean grey block (#1e1d33) at the given aspect.
function Frame({ media, aspect }: { media: MediaDTO; aspect: string }) {
  if (media?.url) return <Media media={media} rounded={false} className={`w-full ${aspect}`} />;
  return <div className={`relative w-full ${aspect} bg-e3`} role="img" aria-label="placeholder" />;
}

const GREY_TILES = 4; // TODO(figma): empty-gallery placeholder tile count

export default function SpeakerSidetray({
  speaker,
  gallery,
  press,
  onClose,
}: {
  speaker: PastEventSpeakerDTO;
  gallery: MediaDTO[];
  press: PressDTO[];
  onClose: () => void;
}) {
  const hasGallery = gallery.length > 0;
  const [shown, setShown] = useState(hasGallery ? Math.min(4, gallery.length) : GREY_TILES);
  const tiles: (MediaDTO | null)[] = hasGallery ? gallery.slice(0, shown) : Array.from({ length: GREY_TILES }, () => null);

  return (
    // z-[60] sits above the past-event modal (z-50).
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-md md:backdrop-blur-2xl" onClick={onClose}>
      {/* 800px mid-width (Manmeet). TODO(figma): padding, inset. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${speaker.name} — speaker profile`}
        onClick={(e) => e.stopPropagation()}
        className="relative m-6 flex h-[calc(100%-3rem)] w-full max-w-[800px] flex-col overflow-hidden bg-e1 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center bg-e3 text-white/80 transition hover:text-white"
        >
          <CloseX />
        </button>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* HERO — photo + name (creme) / designation (white) BOTTOM-aligned + CTA */}
          <section className="relative">
            {/* TODO(figma): hero photo aspect */}
            <Frame media={speaker.photo} aspect="aspect-[4/5]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-page/90 via-page/30 to-transparent p-4">
              {/* TODO(figma): name + designation sizes */}
              <h3 className="text-3xl font-medium leading-tight text-creme">{speaker.name}</h3>
              {speaker.title && <p className="mt-1 text-base leading-snug text-white">{speaker.title}</p>}
              {speaker.ctaUrl && (
                <a
                  href={speaker.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-creme underline-offset-4 hover:underline"
                >
                  {speaker.ctaLabel}
                  <ArrowUpRight />
                </a>
              )}
            </div>
          </section>

          {/* ABOUT — pastEventSpeaker.bio */}
          {speaker.bio && (
            <section>
              <Eyebrow>About</Eyebrow>
              {/* TODO(figma): body size */}
              <p className="mt-3 text-base leading-relaxed text-hi">{speaker.bio}</p>
            </section>
          )}

          {/* VISUALS — reuse the edition gallery (empty → grey tiles) */}
          <section>
            <Eyebrow>Visuals</Eyebrow>
            {/* TODO(figma): columns / gap / tile aspect */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              {tiles.map((t, i) =>
                t?.url ? (
                  <Media key={i} media={t} rounded={false} grey className="aspect-square w-full" />
                ) : (
                  <div key={i} className="aspect-square w-full bg-e3" aria-hidden />
                ),
              )}
            </div>
            {hasGallery && shown < gallery.length && (
              <button onClick={() => setShown((n) => n + 4)} className="mt-3 w-full bg-e3 py-3 text-sm text-white transition hover:bg-rhi">
                Load More
              </button>
            )}
          </section>

          {/* PRESS — edition press cards */}
          {press.length > 0 && (
            <section>
              <Eyebrow>Press</Eyebrow>
              <div className="mt-3 space-y-3">
                {press.map((p) => (
                  <PressCard key={p.id} item={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

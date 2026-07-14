'use client';

import { useState } from 'react';
import type { PastEventSpeakerDTO, MediaDTO, PressDTO } from '@/lib/map';
import { hasRealCta } from '@/lib/cta';
import Media from '../Media';
import { Eyebrow } from './eyebrow';
import { PressCard } from './PressCard';
import { GalleryTile } from './GalleryTile';
import { ArrowUpRight } from '../Icons';

/*
 * Speaker Profile sidetray — sizes from node 9-6786. 800px mid-width (desktop);
 * mobile = vertical hero (photo full-width, name/designation below), desktop =
 * horizontal (photo left, name/designation bottom-aligned right). Grey blocks for
 * unset media. Sections: hero → ABOUT → VISUALS (edition gallery) → PRESS.
 */

function CloseX() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="square" aria-hidden="true">
      <line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  );
}

function Frame({ media, aspect }: { media: MediaDTO; aspect: string }) {
  if (media?.url) return <Media media={media} rounded={false} className={`w-full ${aspect}`} />;
  return <div className={`relative w-full ${aspect} bg-e3`} role="img" aria-label="placeholder" />;
}

const GREY_TILES = 4; // empty-gallery placeholder tiles

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
      {/* 800px mid-width (node 9-6786). */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${speaker.name} — speaker profile`}
        onClick={(e) => e.stopPropagation()}
        className="relative m-6 flex h-[calc(100%-3rem)] w-full max-w-[800px] flex-col overflow-hidden bg-e1 shadow-2xl"
      >
        {/* Top bar — "Speaker Profile" 24px white + E3 close */}
        <div className="flex shrink-0 items-center justify-between px-3 pb-4 pt-6">
          <span className="font-grotesk text-2xl font-normal text-white">Speaker Profile</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center bg-e3 text-white/80 transition hover:text-white"
          >
            <CloseX />
          </button>
        </div>

        {/* Content: 12px sides / 24 bottom, 16px inter-section gaps. */}
        <div className="flex-1 space-y-4 overflow-y-auto px-3 pb-6">
          {/* HERO — 1:1 photo. Mobile vertical (name/designation below); desktop
              horizontal (photo left, name/designation bottom-aligned right). Gap 10. */}
          <section className="flex flex-col gap-[10px] md:flex-row md:items-end">
            <div className="w-full shrink-0 md:w-[342px]">
              <Frame media={speaker.photo} aspect="aspect-square" />
            </div>
            <div className="md:flex-1">
              {/* Name 24/20 creme, designation 16/18 white, CTA 12 medium white */}
              <h3 className="font-grotesk text-2xl font-normal leading-[20px] text-creme">{speaker.name}</h3>
              {speaker.title && <p className="mt-2 text-base font-normal leading-[18px] text-white">{speaker.title}</p>}
              {hasRealCta(speaker.ctaUrl) && (
                <a
                  href={speaker.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-white underline-offset-4 hover:underline"
                >
                  {speaker.ctaLabel}
                  <ArrowUpRight />
                </a>
              )}
            </div>
          </section>

          {/* ABOUT — bio, 16/18 white */}
          {speaker.bio && (
            <section>
              <Eyebrow tone="text-white">About</Eyebrow>
              <p className="mt-3 text-base font-normal leading-[18px] text-white">{speaker.bio}</p>
            </section>
          )}

          {/* VISUALS — edition gallery, 2-col gap 16, ~5:7 tiles (empty → grey) */}
          <section>
            <Eyebrow tone="text-white">Visuals</Eyebrow>
            <div className="mt-3 grid grid-cols-2 gap-0">
              {tiles.map((t, i) => (
                <GalleryTile key={i} media={t} />
              ))}
            </div>
            {hasGallery && shown < gallery.length && (
              <button onClick={() => setShown((n) => n + 4)} className="mt-3 w-full bg-e3 py-3 text-sm text-white transition hover:bg-rhi">
                Load More
              </button>
            )}
          </section>

          {/* PRESS — edition press cards (with image) */}
          {press.length > 0 && (
            <section>
              <Eyebrow tone="text-white">Press</Eyebrow>
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

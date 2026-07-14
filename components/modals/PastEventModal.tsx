'use client';

import { useState } from 'react';
import type { PastEventDTO, MediaDTO, PastEventSpeakerDTO } from '@/lib/map';
import Media from '../Media';
import { SpeakerCard } from '../SpeakerCard';
import { Eyebrow } from './eyebrow';
import { PressCard } from './PressCard';
import { GalleryTile } from './GalleryTile';
import { Documentary } from './Documentary';
import SpeakerSidetray from './SpeakerSidetray';

/*
 * Sizes from Figma node 9-6651 (mobile-exact); desktop is responsive (694px
 * container). A few values are approximate and marked APPROX(figma) — the hero
 * title size and exact panel top/header height weren't retrievable from the node.
 */

function CloseX() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="square" aria-hidden="true">
      <line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}
// Section heading — 48px / 52 lh Founders Grotesk Regular.
function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-3 font-grotesk text-[48px] font-normal leading-[52px] text-white">{children}</h3>;
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Image if set, else a clean grey block (#1e1d33) at the given aspect.
function Frame({
  media,
  aspect,
  position,
  bordered = false,
  emptyFill = 'bg-e3',
}: {
  media: MediaDTO;
  aspect: string;
  position?: string;
  // Documentary-only: navy 4px frame + 8px radius (node 9-6689). Hero/keynote leave off.
  bordered?: boolean;
  emptyFill?: string;
}) {
  const frame = bordered ? 'border-4 border-[#1e1d33] rounded-[8px] overflow-hidden' : '';
  if (media?.url) return <Media media={media} rounded={false} position={position} className={`w-full ${aspect} ${frame}`} />;
  return <div className={`relative w-full ${aspect} ${emptyFill} ${frame}`} role="img" aria-label="placeholder" />;
}

const GREY_TILES = 6; // empty-gallery placeholder tiles (node 9-6651)

export default function PastEventModal({ data, onClose }: { data: PastEventDTO; onClose: () => void }) {
  const date = formatDate(data.dateTime);
  const hasGallery = data.gallery.length > 0;
  const [shown, setShown] = useState(hasGallery ? Math.min(4, data.gallery.length) : GREY_TILES);
  const tiles: (MediaDTO | null)[] = hasGallery ? data.gallery.slice(0, shown) : Array.from({ length: GREY_TILES }, () => null);
  const yy = data.year ? String(data.year).slice(-2) : '';
  // Documentary section renders only when there's an actual video or poster —
  // otherwise the whole <section> is omitted so space-y-4 doesn't leave a double gap.
  const hasDocumentary = !!(data.documentaryVideoUrl || data.documentaryMedia.url);
  // Clicking a speaker card opens the Speaker Profile sidetray (edition gallery + press reused).
  const [openSpk, setOpenSpk] = useState<PastEventSpeakerDTO | null>(null);

  return (
    <>
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md md:backdrop-blur-2xl" onClick={onClose}>
      {/* Container: 694px wide (desktop). Mobile inset 12px sides (node 9-6651). */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${data.editionLabel || data.title} — past event`}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-3 my-3 flex h-[calc(100%-1.5rem)] w-full max-w-[694px] flex-col overflow-hidden bg-e1 shadow-2xl md:m-6 md:h-[calc(100%-3rem)]"
      >
        {/* Header bar — edition label + close (occupies the modal's ~64px top zone). */}
        <div className="flex shrink-0 items-center justify-between px-3 pb-2 pt-3 md:px-4 md:pt-4">
          <span className="text-sm font-medium uppercase tracking-[0.1em] text-white/70">AIS Editions / {yy}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center bg-e3 text-white/80 transition hover:text-white"
          >
            <CloseX />
          </button>
        </div>

        {/* Scrollable inner: 12px sides / 24 bottom, 16px inter-section gaps. */}
        <div className="flex-1 space-y-4 overflow-y-auto px-3 pb-6 md:px-4">
          {/* ① HERO — full content width, 3:4, title + venue/date overlaid on the image */}
          <section className="relative">
            <Frame media={data.hero} aspect="aspect-[3/4]" position="center 30%" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-page/90 via-page/30 to-transparent p-4">
              {/* APPROX(figma): hero title size */}
              <h3 className="text-3xl font-medium leading-tight text-white">{data.title}</h3>
              {(data.location || date) && (
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/85">
                  {data.location && <span className="inline-flex items-center gap-1.5"><PinIcon />{data.location}</span>}
                  {date && <span className="inline-flex items-center gap-1.5"><CalIcon />{date}</span>}
                </div>
              )}
            </div>
          </section>

          {/* ② DOCUMENTARY / VIDEO — 3:4 navy-framed poster (node 9-6689). With a
              documentaryVideoUrl it plays: click expands 3:4 → 16:9 + youtube-nocookie.
              Omitted entirely when there's neither a video nor a poster (no dead block). */}
          {hasDocumentary && (
            <section>
              <Documentary media={data.documentaryMedia} videoUrl={data.documentaryVideoUrl} />
            </section>
          )}

          {/* ③ SPEAKERS — profile cards, 2-col desktop / 1-col mobile, 1:1 photos, 16px gap */}
          {data.speakers.length > 0 && (
            <section>
              <Eyebrow tone="text-white">Speakers</Eyebrow>
              <Heading>Speakers</Heading>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.speakers.map((s) => (
                  <SpeakerCard
                    key={s.id}
                    photoAspect="aspect-square"
                    onClick={() => setOpenSpk(s)}
                    data={{ photo: s.photo, name: s.name, role: s.title, ctaLabel: s.ctaLabel, ctaUrl: s.ctaUrl }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ④ VISUALS — creme-border tiles, 2-col, gap-0, 5:7 (node 9-6813) */}
          <section>
            <Eyebrow tone="text-white">Visuals</Eyebrow>
            <Heading>Visuals from AIS</Heading>
            <div className="mt-4 grid grid-cols-2 gap-0">
              {tiles.map((t, i) => (
                <GalleryTile key={i} media={t} />
              ))}
            </div>
            {hasGallery && shown < data.gallery.length && (
              <button onClick={() => setShown((n) => n + 4)} className="mt-3 w-full bg-e3 py-3 text-sm text-white transition hover:bg-rhi">
                Load More
              </button>
            )}
          </section>

          {/* ⑤ KEYNOTE — intro + keynoteMedia (~1:1) + session cards */}
          {(data.keynoteIntro || data.sessions.length > 0) && (
            <section>
              <Eyebrow tone="text-white">Keynote</Eyebrow>
              {data.keynoteIntro && <p className="mt-3 text-base leading-relaxed text-hi">{data.keynoteIntro}</p>}
              <div className="mt-4"><Frame media={data.keynoteMedia} aspect="aspect-square" /></div>
              <div className="mt-4 flex flex-col gap-4">
                {data.sessions.map((s) => (
                  <article key={s.id} className="border border-rule bg-e1 px-3 pb-4 pt-3">
                    <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.1em] text-white/70">
                      {s.date && <span>{s.date}</span>}
                      {s.date && s.time && <span className="text-creme">•</span>}
                      {s.time && <span>{s.time}</span>}
                    </div>
                    <h5 className="mt-2 text-xl font-medium leading-6 text-white">{s.title}</h5>
                    {s.description && <p className="mt-2 text-sm leading-relaxed text-white/70">{s.description}</p>}
                    {s.speakers.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {s.speakers.map((sp) => (
                          <span key={sp.id} className="inline-flex items-center gap-2 text-sm font-medium text-white">
                            {sp.photo?.url ? (
                              <Media media={sp.photo} rounded className="h-6 w-6 shrink-0" />
                            ) : (
                              <span className="h-6 w-6 shrink-0 rounded-full bg-e3" aria-hidden />
                            )}
                            {sp.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ⑥ PRESS — eyebrow only (no 48px heading), press cards with image */}
          {data.press.length > 0 && (
            <section>
              <Eyebrow tone="text-white">Press</Eyebrow>
              <div className="mt-4 flex flex-col gap-4">
                {data.press.map((p) => (
                  <PressCard key={p.id} item={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>

    {/* Speaker Profile sidetray — sibling of the modal overlay so its backdrop
        clicks close only the sidetray, not the modal underneath. */}
    {openSpk && (
      <SpeakerSidetray
        speaker={openSpk}
        gallery={data.gallery}
        press={data.press}
        onClose={() => setOpenSpk(null)}
      />
    )}
    </>
  );
}

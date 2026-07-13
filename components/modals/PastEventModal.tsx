'use client';

import { useState } from 'react';
import type { PastEventDTO, MediaDTO } from '@/lib/map';
import Media from '../Media';
import { SpeakerCard } from '../SpeakerCard';
import { Crosshair } from '../Crosshair';

/*
 * P4 STRUCTURE ONLY — spacing/size/aspect values marked `TODO(figma)` are provisional
 * placeholders pending exact values from nodes 9-6651 (mobile 390) / 9-6786 (edition
 * full). Section order per spec: hero → documentary → speakers → visuals → keynote.
 * Speaker cards use the shared homepage profile card, render-only (tray deferred).
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
function PlayIcon() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-white"><path d="M6 4l14 8-14 8z" /></svg>
    </span>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mid">
      <Crosshair size={9} className="text-creme" />
      {children}
    </h4>
  );
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Image if set, else a clean grey block at the given aspect (optional play affordance).
function Frame({ media, aspect, play = false, position }: { media: MediaDTO; aspect: string; play?: boolean; position?: string }) {
  if (media?.url) return <Media media={media} rounded={false} position={position} className={`w-full ${aspect}`} />;
  return (
    <div className={`relative w-full ${aspect} bg-e3`} role="img" aria-label="placeholder">
      {play && <span className="absolute inset-0 flex items-center justify-center"><PlayIcon /></span>}
    </div>
  );
}

const GREY_TILES = 6; // TODO(figma): empty-gallery placeholder tile count

export default function PastEventModal({ data, onClose }: { data: PastEventDTO; onClose: () => void }) {
  const date = formatDate(data.dateTime);
  const hasGallery = data.gallery.length > 0;
  const [shown, setShown] = useState(hasGallery ? Math.min(4, data.gallery.length) : GREY_TILES);
  const tiles: (MediaDTO | null)[] = hasGallery ? data.gallery.slice(0, shown) : Array.from({ length: GREY_TILES }, () => null);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md md:backdrop-blur-2xl" onClick={onClose}>
      {/* TODO(figma): panel width (spec gave "min 694px" — width vs height?) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${data.editionLabel || data.title} — past event`}
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

        {/* Scrollable container: 16px padding all sides, min 694px, scrolls inside */}
        <div className="min-h-[694px] flex-1 overflow-y-auto p-4">
          {/* ① HERO — fullwidth heroMedia + title + venue/date */}
          <section>
            <div className="relative">
              <Frame media={data.hero} aspect="aspect-[4/3]" position="center 30%" />
              {/* TODO(figma): title placement/size (overlaid on cover in ref) */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-page/85 to-transparent p-5">
                <h3 className="text-3xl font-medium leading-tight text-white">{data.title}</h3>
              </div>
            </div>
            {(data.location || date) && (
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/85">
                {data.location && <span className="inline-flex items-center gap-1.5"><PinIcon />{data.location}</span>}
                {date && <span className="inline-flex items-center gap-1.5"><CalIcon />{date}</span>}
              </div>
            )}
          </section>

          {/* ② DOCUMENTARY / VIDEO — documentaryMedia (unset → grey + play) */}
          <section className="mt-6">
            {/* TODO(figma): documentary aspect ratio */}
            <Frame media={data.documentaryMedia} aspect="aspect-video" play />
          </section>

          {/* ③ SPEAKERS — shared profile cards, render-only (not tray-clickable yet) */}
          {data.speakers.length > 0 && (
            <section className="mt-10">
              <Eyebrow>Speakers</Eyebrow>
              {/* TODO(figma): heading size */}
              <h4 className="mt-3 font-grotesk text-4xl font-normal text-white">Speakers</h4>
              {/* TODO(figma): card layout (stacked vs grid) + gap on desktop */}
              <div className="mt-4 flex flex-col gap-4">
                {data.speakers.map((s) => (
                  <SpeakerCard key={s.id} data={{ photo: s.photo, name: s.name, role: s.title, ctaLabel: s.ctaLabel }} />
                ))}
              </div>
            </section>
          )}

          {/* ④ VISUALS — gallery 2-col + Load More (empty → grey tiles) */}
          <section className="mt-10">
            <Eyebrow>Visuals</Eyebrow>
            <h4 className="mt-3 font-grotesk text-4xl font-normal text-white">Visuals from AIS</h4>
            {/* TODO(figma): gallery gap + tile aspect */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {tiles.map((t, i) =>
                t?.url ? (
                  <Media key={i} media={t} rounded={false} grey className="aspect-square w-full" />
                ) : (
                  <div key={i} className="aspect-square w-full bg-e3" aria-hidden />
                ),
              )}
            </div>
            {hasGallery && shown < data.gallery.length && (
              <button onClick={() => setShown((n) => n + 4)} className="mt-3 w-full bg-e3 py-3 text-sm text-white transition hover:bg-rhi">
                Load More
              </button>
            )}
          </section>

          {/* ⑤ KEYNOTE — intro + keynoteMedia + session cards */}
          {(data.keynoteIntro || data.sessions.length > 0) && (
            <section className="mt-10">
              <Eyebrow>Keynote</Eyebrow>
              {data.keynoteIntro && <p className="mt-3 text-lg leading-relaxed text-hi">{data.keynoteIntro}</p>}
              {/* TODO(figma): keynote image aspect */}
              <div className="mt-4"><Frame media={data.keynoteMedia} aspect="aspect-[16/10]" /></div>
              <div className="mt-4 flex flex-col gap-4">
                {data.sessions.map((s) => (
                  <article key={s.id} className="border border-rule bg-e1 p-5">
                    {/* TODO(figma): session card paddings + type sizes + chip avatar size */}
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/70">
                      {s.date && <span>{s.date}</span>}
                      {s.date && s.time && <span className="text-creme">•</span>}
                      {s.time && <span>{s.time}</span>}
                    </div>
                    <h5 className="mt-2 text-xl font-medium leading-tight text-white">{s.title}</h5>
                    {s.description && <p className="mt-2 text-sm leading-relaxed text-white/70">{s.description}</p>}
                    {s.speakers.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {s.speakers.map((sp) => (
                          <span key={sp.id} className="inline-flex items-center gap-2 text-xs font-medium text-white">
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
        </div>
      </div>
    </div>
  );
}

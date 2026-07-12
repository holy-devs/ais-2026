'use client';

import { useState } from 'react';
import type { SpeakerDTO } from '@/lib/map';
import Media from '../Media';

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 19 3 12l7-7" />
      <path d="M3 12h18" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mid">
      <span className="text-creme">•</span>
      {children}
    </h4>
  );
}

export default function SpeakerProfileModal({ data, onClose }: { data: SpeakerDTO; onClose: () => void }) {
  const [visualsShown, setVisualsShown] = useState(4);
  const visuals = data.visuals.slice(0, visualsShown);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-e1 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-e1/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={onClose} aria-label="Back" className="text-white/70 transition hover:text-creme"><BackIcon /></button>
            <span className="text-base text-white">Speaker Profile</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-rule text-white/70 transition hover:text-creme"
          >
            ✕
          </button>
        </header>

        <div className="px-5 py-6">
          <Media media={data.portrait} rounded={false} className="aspect-[4/5] w-full grayscale" />
          <h3 className="mt-5 text-2xl font-medium text-white">{data.name}</h3>
          {data.role && <p className="mt-1 text-sm text-mid">{data.role}</p>}

          {data.ctaUrl && (
            <a
              href={data.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-xs uppercase tracking-[0.15em] text-white underline-offset-4 transition hover:text-creme hover:underline"
            >
              {data.ctaLabel}
            </a>
          )}

          {data.bioHtml && (
            <div
              className="mt-6 space-y-3 text-sm leading-relaxed text-hi [&_a]:text-creme [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: data.bioHtml }}
            />
          )}

          {data.visuals.length > 0 && (
            <section className="mt-8">
              <Eyebrow>Visuals</Eyebrow>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {visuals.map((v, i) => (
                  <Media key={i} media={v} rounded={false} className="aspect-square w-full" />
                ))}
              </div>
              {visualsShown < data.visuals.length && (
                <button
                  onClick={() => setVisualsShown((n) => n + 4)}
                  className="mt-2 w-full bg-e3 py-3 text-sm text-white transition hover:bg-rhi"
                >
                  Load More
                </button>
              )}
            </section>
          )}

          {data.press.length > 0 && (
            <section className="mt-8">
              <Eyebrow>Press</Eyebrow>
              <div className="mt-3 space-y-6">
                {data.press.map((p, i) => (
                  <article key={i}>
                    {p.date && <p className="text-xs text-mid">{p.date}</p>}
                    <h5 className="mt-1 text-lg font-medium text-white">{p.title}</h5>
                    {p.body && <div className="mt-1 text-sm leading-relaxed text-mid" dangerouslySetInnerHTML={{ __html: p.body }} />}
                    {p.byline && <p className="mt-2 text-xs font-medium text-white">by {p.byline}</p>}
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

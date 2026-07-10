'use client';

import type { SpeakerDTO } from '@/lib/map';
import Media from '../Media';

export default function SpeakerProfileModal({ data, onClose }: { data: SpeakerDTO; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-e1 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-e1/95 px-6 py-4 backdrop-blur">
          <span className="text-xs uppercase tracking-[0.2em] text-mid">Speaker Profile</span>
          <button onClick={onClose} aria-label="Close" className="text-mid transition hover:text-creme">✕</button>
        </header>

        <div className="px-6 py-6">
          <Media media={data.portrait} className="aspect-[4/5] w-full" />
          <h3 className="mt-5 text-2xl font-medium text-white">{data.name}</h3>
          {data.role && <p className="mt-1 text-sm text-mid">{data.role}</p>}

          {data.ctaUrl && (
            <a
              href={data.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 border border-creme/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-creme transition hover:bg-creme hover:text-page"
            >
              {data.ctaLabel} ↗
            </a>
          )}

          {data.bioHtml && (
            <div
              className="prose-invert mt-6 space-y-3 text-sm leading-relaxed text-hi [&_a]:text-creme [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: data.bioHtml }}
            />
          )}

          {data.visuals.length > 0 && (
            <section className="mt-8">
              <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-mid">Visuals</h4>
              <div className="grid grid-cols-2 gap-2">
                {data.visuals.map((v, i) => (
                  <Media key={i} media={v} className="aspect-square w-full" />
                ))}
              </div>
            </section>
          )}

          {data.press.length > 0 && (
            <section className="mt-8">
              <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-mid">On the Record</h4>
              <div className="space-y-4">
                {data.press.map((p, i) => (
                  <article key={i} className="border border-rule bg-e2 p-4">
                    {p.date && <p className="text-xs text-mid">{p.date}</p>}
                    <h5 className="mt-1 font-medium text-white">{p.title}</h5>
                    {p.body && (
                      <div className="mt-2 text-sm text-hi" dangerouslySetInnerHTML={{ __html: p.body }} />
                    )}
                    {p.byline && <p className="mt-2 text-xs text-mid">by {p.byline}</p>}
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

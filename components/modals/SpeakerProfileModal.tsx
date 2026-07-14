'use client';

import { useState } from 'react';
import type { SpeakerDTO } from '@/lib/map';
import { hasRealCta } from '@/lib/cta';
import Media from '../Media';
import TrayShell, { Eyebrow } from './TrayShell';
import { GlassButton } from '../Buttons';
import { ArrowUpRight } from '../Icons';

export default function SpeakerProfileModal({ data, onClose }: { data: SpeakerDTO; onClose: () => void }) {
  const [visualsShown, setVisualsShown] = useState(4);
  const visuals = data.visuals.slice(0, visualsShown);

  return (
    <TrayShell onClose={onClose} label={`${data.name} — speaker profile`}>
      {/* Two-column header: portrait left, identity + CTA right (review C2) */}
      <div className="grid gap-6 pr-12 md:grid-cols-[minmax(0,300px)_1fr]">
        <Media media={data.portrait} rounded={false} className="aspect-[4/5] w-full grayscale" />
        <div className="flex flex-col">
          <h3 className="text-3xl font-medium leading-tight text-white md:text-4xl">{data.name}</h3>
          {data.role && <p className="mt-2 text-base text-mid">{data.role}</p>}
          {data.oneLiner && data.oneLiner !== data.role && (
            <p className="mt-1 text-sm text-low">{data.oneLiner}</p>
          )}
          {hasRealCta(data.ctaUrl) && (
            <div className="mt-6">
              <GlassButton href={data.ctaUrl} external label={data.ctaLabel} icon={<ArrowUpRight />} />
            </div>
          )}
        </div>
      </div>

      {/* ABOUT — bio (render only if populated) */}
      {data.bioHtml && (
        <section className="mt-10">
          <Eyebrow>About</Eyebrow>
          <div
            className="mt-3 space-y-3 text-lg leading-relaxed text-hi [&_a]:text-creme [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: data.bioHtml }}
          />
        </section>
      )}

      {/* VISUALS — 2-column grid + Load More */}
      {data.visuals.length > 0 && (
        <section className="mt-10">
          <Eyebrow>Visuals</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {visuals.map((v, i) => (
              <Media key={i} media={v} rounded={false} className="aspect-square w-full" />
            ))}
          </div>
          {visualsShown < data.visuals.length && (
            <div className="mt-3">
              <GlassButton onClick={() => setVisualsShown((n) => n + 4)} label="Load More" />
            </div>
          )}
        </section>
      )}

      {/* PRESS — cards, hover E1→E3 (no image field in the model → text card) */}
      {data.press.length > 0 && (
        <section className="mt-10">
          <Eyebrow>Press</Eyebrow>
          <div className="mt-3 space-y-3">
            {data.press.map((p, i) => (
              <article
                key={i}
                className="border border-rule bg-e1 p-5 transition-colors duration-300 hover:bg-e3"
              >
                {p.date && <p className="text-xs text-mid">{p.date}</p>}
                <h5 className="mt-1 text-lg font-medium text-white">{p.title}</h5>
                {p.body && (
                  <div className="mt-2 text-sm leading-relaxed text-mid" dangerouslySetInnerHTML={{ __html: p.body }} />
                )}
                {p.byline && <p className="mt-2 text-xs font-medium text-white">by {p.byline}</p>}
              </article>
            ))}
          </div>
        </section>
      )}
    </TrayShell>
  );
}

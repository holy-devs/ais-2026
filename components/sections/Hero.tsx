import { f, mapAction, media } from '@/lib/map';
import Media from '../Media';
import { CornerMarks } from '../Crosshair';

// Hardcoded — not in the CMS model. Logged in OPEN.md (wire into the hero entry later).
const COORDS = '37.9838°N / 23.7275°E';
const LOCATION_LABEL = 'Athens, Greece';

function SendIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M2.5 20.5 22 12 2.5 3.5v6.6L16 12 2.5 13.9z" />
    </svg>
  );
}

export default function Hero({ entry }: { entry: any }) {
  const x = f(entry);
  const actions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];
  const bg = media(x.keyMedia);

  // Split a trailing year so it can render in the editorial italic accent (design: SUMMIT 2026).
  const title: string = x.title || '';
  const ym = title.match(/^(.*?)\s+(\d{4})\s*$/);
  const head = ym ? ym[1] : title;
  const year = ym ? ym[2] : '';

  return (
    <section id="top" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Media media={bg} rounded={false} className="h-full w-full" />
        {/* Subtle top/bottom vignette — keep the theatre visible, aid nav + text legibility. */}
        <div className="absolute inset-0 bg-gradient-to-b from-page/70 via-page/10 to-page/60" />
      </div>

      <CornerMarks inset={36} size={9} className="text-white/60" />

      <div className="w-full px-6 text-center md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
          <p className="mb-6 text-xs tracking-[0.18em] text-white/80 md:text-sm" data-reveal="words">
            {COORDS}
            <span className="mx-3 text-white/40">·</span>
            {LOCATION_LABEL}
          </p>

          <h1
            className="font-grotesk text-6xl font-medium uppercase leading-[0.9] tracking-[-0.01em] text-white sm:text-7xl md:text-8xl lg:text-[8.5rem]"
            data-reveal="lines"
          >
            {head}
            {year && (
              <>
                {' '}
                <span className="font-editorial text-[0.92em] font-normal normal-case italic text-creme">{year}</span>
              </>
            )}
          </h1>

          {x.supertitle && (
            <p className="mt-5 text-lg text-white/85 md:text-xl" data-reveal="words">
              <span className="text-white/55">by </span>
              <span className="lowercase tracking-tight">{x.supertitle.replace(/^by\s+/i, '')}</span>
            </p>
          )}

          {actions.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {actions.map((a: any, i: number) =>
                a.style === 'Primary' ? (
                  <a
                    key={i}
                    href={a.href}
                    className="inline-flex items-stretch bg-white text-page transition hover:opacity-90"
                  >
                    <span className="px-5 py-3 text-sm font-medium">{a.label}</span>
                    <span className="my-2 border-l border-dashed border-page/30" />
                    <span className="flex items-center px-3.5"><SendIcon /></span>
                  </a>
                ) : (
                  <a
                    key={i}
                    href={a.href}
                    className="bg-page/50 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-page/70"
                  >
                    {a.label}
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

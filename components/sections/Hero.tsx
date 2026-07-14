import { f, mapAction, media } from '@/lib/map';
import Media from '../Media';
import { CornerMarks } from '../Crosshair';
import { SendIcon, EndeavorWordmark } from '../Icons';
import { GlassButton } from '../Buttons';

// Hardcoded — not in the CMS model. Logged in OPEN.md (wire into the hero entry later).
const COORDS = '37.9838°N / 23.7275°E';
const LOCATION_LABEL = 'Athens, Greece';

export default function Hero({ entry, ticketsEnabled = true }: { entry: any; ticketsEnabled?: boolean }) {
  const x = f(entry);
  const allActions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];
  // Tickets off → drop the Primary "Get Tickets" action; the justify-center flex
  // re-centers the remaining "Past Editions" with no gap.
  const actions = ticketsEnabled ? allActions : allActions.filter((a: any) => a.style !== 'Primary');
  const bg = media(x.keyMedia);

  // Split a trailing year for the editorial italic accent, then break the head into
  // "all but last word" / "last word", so desktop renders 2 lines (ATHENS INNOVATION /
  // SUMMIT 2026) exactly like hero.png; the fluid size lets 390px wrap to 4 lines.
  const title: string = x.title || '';
  const ym = title.match(/^(.*?)\s+(\d{4})\s*$/);
  const head = ym ? ym[1] : title;
  const year = ym ? ym[2] : '';
  const words = head.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop()! : '';
  const lead = words.join(' ');

  return (
    <section
      id="top"
      // Mobile: cap the hero at ~670px so the key-info strip peeks below (review D1).
      // Desktop: full viewport height as before.
      className="relative isolate flex h-[min(670px,88vh)] items-center justify-center overflow-hidden md:h-auto md:min-h-screen"
    >
      <div className="absolute inset-0 -z-10">
        <Media media={bg} rounded={false} className="h-full w-full" />
        {/* Subtle top/bottom vignette — keep the theatre visible, aid nav + text legibility. */}
        <div className="absolute inset-0 bg-gradient-to-b from-page/70 via-page/10 to-page/60" />
      </div>

      {/* A1: all four crosshairs on the hero section itself — decorative, non-sticky,
          at the extreme corners enclosing the hero content (menu included). */}
      <CornerMarks inset={24} size={9} className="z-30 text-white/60" />

      <div className="w-full px-6 text-center md:px-9">
        <div className="mx-auto flex w-full max-w-content flex-col items-center">
          {/* A7: coordinates strip in creme (designer). */}
          <p className="mb-6 text-[14px] leading-none tracking-[-0.02em] text-creme" data-reveal="words">
            {COORDS}
            <span className="mx-3 text-creme/40">·</span>
            {LOCATION_LABEL}
          </p>

          <h1
            className="font-grotesk font-medium uppercase leading-[0.73] tracking-[-0.055em] text-white text-[clamp(3rem,11vw,10.25rem)]"
            data-reveal="lines"
          >
            {lead && <span className="block">{lead}</span>}
            <span className="block">
              {last || head}
              {year && (
                <>
                  {' '}
                  <span className="font-editorial text-[0.92em] font-normal normal-case italic text-creme">{year}</span>
                </>
              )}
            </span>
          </h1>

          {x.supertitle && (
            <p className="mt-5 flex items-center justify-center gap-2 text-white/85" data-reveal="words">
              <span className="text-base text-white/55 md:text-lg">by</span>
              <EndeavorWordmark className="h-[15px] w-auto text-white md:h-[18px]" />
            </p>
          )}

          {actions.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {actions.map((a: any, i: number) => (
                <GlassButton
                  key={i}
                  href={a.href}
                  label={a.label}
                  icon={a.style === 'Primary' ? <SendIcon /> : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

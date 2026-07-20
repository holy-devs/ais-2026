import type { MediaDTO } from '@/lib/map';
import { hasRealCta } from '@/lib/cta';
import Media from './Media';
import { Crosshair } from './Crosshair';

export interface SpeakerCardData {
  photo: MediaDTO;
  name: string;
  role?: string;
  detail?: string; // optional muted one-liner
  ctaLabel: string;
  ctaUrl?: string; // label shows only when this is a real URL (hasRealCta)
}

// The v5.0 speaker profile card — shared by the homepage Speakers grid and the
// past-event modal. Interactive (button) when `onClick` is given; a plain div
// otherwise (past-event cards render but aren't yet clickable). `reveal` opts into
// the GSAP scroll reveal (homepage only — the modal mounts after reveals run).
export function SpeakerCard({
  data,
  onClick,
  reveal = false,
  photoAspect = 'aspect-[4/5]',
  crosshairs = false,
}: {
  data: SpeakerCardData;
  onClick?: () => void;
  reveal?: boolean;
  // Homepage grid = 4:5 portrait; past-event modal = 1:1 square (node 9-6651).
  photoAspect?: string;
  // Corner crosshairs — hidden on ALL speaker cards (homepage + past-event) per the
  // A6b amendment; default off. Prop kept for future opt-in via crosshairs.
  crosshairs?: boolean;
}) {
  const cls = 'group relative flex w-full flex-col border border-white/10 text-left';
  const revealAttr = reveal ? { 'data-reveal': 'words' } : {};
  const inner = (
    <>
      {/* Top-corner crosshairs that spin with the B&W→color hover. */}
      {crosshairs && (
        <>
          <span className="pointer-events-none absolute left-0 top-0 z-10 text-white/50 transition-transform duration-500 group-hover:rotate-45">
            <Crosshair size={9} />
          </span>
          <span className="pointer-events-none absolute right-0 top-0 z-10 text-white/50 transition-transform duration-500 group-hover:rotate-45">
            <Crosshair size={9} />
          </span>
        </>
      )}
      <Media
        media={data.photo}
        rounded={false}
        grey
        className={`${photoAspect} max-h-[420px] w-full transition duration-500 md:grayscale md:group-hover:grayscale-0`}
      />
      {/* M12b: vertical stack — name → title → CTA beneath, left-aligned (was a row
          with the CTA pushed right). CTA pinned to the card bottom for grid alignment. */}
      <div className="flex flex-1 flex-col items-start gap-3 p-5">
        <div>
          <h3 className="text-lg font-medium text-white">{data.name}</h3>
          {data.role && <p className="mt-1 text-base leading-[18px] tracking-normal text-white">{data.role}</p>}
          {data.detail && data.detail !== data.role && (
            <p className="mt-1 text-sm leading-[14px] tracking-[-0.02em] text-white/70">{data.detail}</p>
          )}
        </div>
        {/* Real anchor (not a span): navigates to ctaUrl instead of bubbling to the
            card's open-profile handler. z-10 lifts it above the absolute overlay button
            so its own clicks land here; stopPropagation is belt-and-suspenders. External
            → new tab, rel noopener. Hidden entirely for '#'/empty (hasRealCta). */}
        {hasRealCta(data.ctaUrl) && (
          <a
            href={data.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 mt-auto inline-flex w-fit whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-creme underline-offset-4 hover:underline"
          >
            {data.ctaLabel}
          </a>
        )}
      </div>
    </>
  );

  // Interactive card: a plain <div> holds the content + a full-bleed overlay <button>
  // that opens the profile (keeps the whole card clickable AND keyboard-accessible),
  // while the CTA anchor above pokes through at a higher z-index. A <button> wrapping
  // everything would make the CTA anchor invalid (<a> inside <button>).
  if (onClick) {
    return (
      <div className={cls} {...revealAttr}>
        {inner}
        <button
          type="button"
          onClick={onClick}
          aria-label={`Open ${data.name} profile`}
          className="absolute inset-0 z-[1]"
        />
      </div>
    );
  }
  return (
    <div className={cls} {...revealAttr}>
      {inner}
    </div>
  );
}

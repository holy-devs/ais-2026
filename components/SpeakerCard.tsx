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
}: {
  data: SpeakerCardData;
  onClick?: () => void;
  reveal?: boolean;
  // Homepage grid = 4:5 portrait; past-event modal = 1:1 square (node 9-6651).
  photoAspect?: string;
}) {
  const cls = 'group relative flex w-full flex-col border border-white/10 text-left';
  const revealAttr = reveal ? { 'data-reveal': 'words' } : {};
  const inner = (
    <>
      {/* Top-corner crosshairs that spin with the B&W→color hover. */}
      <span className="pointer-events-none absolute left-0 top-0 z-10 text-white/50 transition-transform duration-500 group-hover:rotate-45">
        <Crosshair size={9} />
      </span>
      <span className="pointer-events-none absolute right-0 top-0 z-10 text-white/50 transition-transform duration-500 group-hover:rotate-45">
        <Crosshair size={9} />
      </span>
      <Media
        media={data.photo}
        rounded={false}
        grey
        className={`${photoAspect} w-full transition duration-500 md:grayscale md:group-hover:grayscale-0`}
      />
      <div className="flex flex-1 items-end justify-between gap-3 p-5">
        <div>
          <h3 className="text-lg font-medium text-white">{data.name}</h3>
          {data.role && <p className="mt-1 text-base leading-[18px] tracking-normal text-white">{data.role}</p>}
          {data.detail && data.detail !== data.role && (
            <p className="mt-1 text-sm leading-[14px] tracking-[-0.02em] text-white/70">{data.detail}</p>
          )}
        </div>
        {hasRealCta(data.ctaUrl) && (
          <span className="shrink-0 whitespace-nowrap text-xs uppercase tracking-[0.15em] text-creme">{data.ctaLabel}</span>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={cls} {...revealAttr}>
        {inner}
      </button>
    );
  }
  return (
    <div className={cls} {...revealAttr}>
      {inner}
    </div>
  );
}

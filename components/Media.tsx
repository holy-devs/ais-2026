import type { MediaDTO } from '@/lib/map';

/**
 * Renders media. Real images render as a bare object-cover <img> (no border, no
 * rounding by default — the v5.0 design uses full-bleed, un-bordered photography).
 * Only un-swapped placeholder assets get the labelled `media-ph` box so missing
 * media stays obvious during review.
 */
export default function Media({
  media,
  className = '',
  rounded = false,
  position,
  grey = false,
}: {
  media: MediaDTO;
  className?: string;
  rounded?: boolean;
  /** object-position for the cover crop (e.g. 'center 30%' to keep heads in frame). */
  position?: string;
  /** Render a clean grey block for unset media (no dashed border / label) — used by
      the past-event modal for placeholder blocks at the design aspect. */
  grey?: boolean;
}) {
  const isPlaceholder = !media.url || media.label?.startsWith('placeholder');
  const round = rounded ? 'rounded-lg' : '';

  if (isPlaceholder) {
    if (grey) {
      return <div className={`relative bg-e3 ${round} ${className}`} role="img" aria-label="placeholder" />;
    }
    return (
      <div className={`media-ph relative ${round} ${className}`} role="img" aria-label={media.label}>
        <span className="px-2 text-center">{media.label}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${round} ${className}`} role="img" aria-label={media.label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.label}
        className="h-full w-full object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

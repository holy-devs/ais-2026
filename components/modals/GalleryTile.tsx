import type { MediaDTO } from '@/lib/map';
import Media from '../Media';

// Shared gallery tile (Mapping v.4, node 60-…): creme 0.5px border + 10px padding,
// square corners, 332/376 image (object-cover). Empty fallback = #cde0e3 (light blue-grey,
// reads as an image placeholder, not a void). Used by the past-event modal, the
// speaker sidetray, and the homepage gallery (A6c).
//
// Interactive when `onClick` is given (homepage gallery → opens the lightbox): the
// tile renders as a <button> so the lightbox can restore focus to it on close.
// Without `onClick` it stays a plain <div> (modal/sidetray tiles aren't clickable).
export function GalleryTile({
  media,
  onClick,
  ariaLabel,
}: {
  media: MediaDTO | null;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}) {
  const cls = 'border-[0.5px] border-[#eedecb] p-[10px]';
  const inner = media?.url ? (
    <Media media={media} rounded={false} className="aspect-[332/376] w-full" />
  ) : (
    <div className="aspect-[332/376] w-full bg-[#cde0e3]" aria-hidden />
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={`group block w-full ${cls} transition-colors`}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

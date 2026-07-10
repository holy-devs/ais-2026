import type { MediaDTO } from '@/lib/map';

/**
 * Renders media. Current build ships 1x1 placeholder assets, so we show a clearly
 * labeled placeholder box (the asset title) to keep layout reviewable and make
 * un-swapped media obvious. When real assets land, this swaps to the image.
 */
export default function Media({
  media,
  className = '',
  rounded = true,
}: {
  media: MediaDTO;
  className?: string;
  rounded?: boolean;
}) {
  const isPlaceholder = !media.url || media.label?.startsWith('placeholder');
  return (
    <div
      className={`media-ph relative ${rounded ? 'rounded-lg' : ''} ${className}`}
      role="img"
      aria-label={media.label}
    >
      {!isPlaceholder && media.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.url} alt={media.label} className="h-full w-full object-cover" />
      ) : (
        <span className="px-2 text-center">{media.label}</span>
      )}
    </div>
  );
}

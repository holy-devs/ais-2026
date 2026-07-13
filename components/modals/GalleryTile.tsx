import type { MediaDTO } from '@/lib/map';
import Media from '../Media';

// Shared gallery tile (node 9-6813): creme 0.5px border + 4px padding, square
// corners, 5:7 image (object-cover). Empty fallback = #cde0e3 (light blue-grey,
// reads as an image placeholder, not a void). Used by the past-event modal + the
// speaker sidetray. Do NOT use for the homepage GalleryClient.
export function GalleryTile({ media }: { media: MediaDTO | null }) {
  return (
    <div className="border-[0.5px] border-[#eedecb] p-[4px]">
      {media?.url ? (
        <Media media={media} rounded={false} className="aspect-[5/7] w-full" />
      ) : (
        <div className="aspect-[5/7] w-full bg-[#cde0e3]" aria-hidden />
      )}
    </div>
  );
}

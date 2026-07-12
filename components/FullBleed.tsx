import type { ReactNode } from 'react';

// Edge-to-edge section wrapper for the v5.0 full-bleed photography treatment.
// `media` renders behind everything (absolute inset-0); `scrim` toggles a dark
// gradient for text legibility. Content is centered in a max-width container
// unless `contain={false}`. Use `Section` instead for plain padded content.
export default function FullBleed({
  id,
  className = '',
  media,
  scrim = true,
  contain = true,
  padded = true,
  children,
}: {
  id?: string;
  className?: string;
  media?: ReactNode;
  scrim?: boolean;
  contain?: boolean;
  padded?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative isolate overflow-hidden ${className}`}>
      {media && (
        <div className="absolute inset-0 -z-10">
          {media}
          {scrim && <div className="absolute inset-0 bg-gradient-to-t from-page via-page/70 to-page/30" />}
        </div>
      )}
      <div
        className={
          contain
            ? `mx-auto w-full max-w-6xl ${padded ? 'px-6 py-20 md:px-10 md:py-28' : ''}`
            : padded
              ? 'px-6 py-20 md:px-10 md:py-28'
              : ''
        }
      >
        {children}
      </div>
    </section>
  );
}

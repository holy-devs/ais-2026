import { f, media } from '@/lib/map';
import Section from '../Section';

// Logos on dark tiles (Components.png logo-block convention): centered, object-contain
// so brand marks aren't cropped. Uses object-cover-free rendering (not <Media>, which
// crops). Section is kept live with Google + Endeavor; sponsors arrive later.
export default function Partners({ entry }: { entry: any }) {
  const x = f(entry);
  const logos = Array.isArray(x.logos) ? x.logos.map(media) : [];
  if (logos.length === 0) return null;

  return (
    <Section className="py-12 md:py-16">
      {x.title && (
        <h2 className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-mid" data-reveal="words">
          {x.title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {logos.map((logo, i) => (
          <div key={i} className="flex aspect-[3/2] items-center justify-center bg-e2 p-8">
            {logo.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.url} alt={logo.label} className="max-h-full max-w-full object-contain" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

import { f, media } from '@/lib/map';
import Section from '../Section';
import Media from '../Media';

export default function Partners({ entry }: { entry: any }) {
  const x = f(entry);
  const logos = Array.isArray(x.logos) ? x.logos.map(media) : [];

  return (
    <Section className="py-12 md:py-16">
      {x.title && (
        <h2 className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-mid" data-reveal="words">
          {x.title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {logos.map((logo, i) => (
          <Media key={i} media={logo} className="aspect-[3/2] w-full" />
        ))}
      </div>
    </Section>
  );
}

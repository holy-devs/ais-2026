import { f, media } from '@/lib/map';
import Section from '../Section';
import GalleryClient from './GalleryClient';
import { ArrowDownRight } from '../Icons';

export default function Gallery({ entry }: { entry: any }) {
  const x = f(entry);
  const images = Array.isArray(x.media) ? x.media.map(media) : [];

  return (
    <Section id="gallery">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <ArrowDownRight className="text-creme" />
          <h2 className="mt-6 max-w-[10em] font-grotesk text-3xl font-normal leading-tight text-creme md:text-4xl" data-reveal="lines">
            {x.title}
          </h2>
        </div>
        <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.2em] text-mid">• Visuals</span>
      </div>
      <GalleryClient images={images} />
    </Section>
  );
}

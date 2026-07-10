import { f, media } from '@/lib/map';
import Section from '../Section';
import GalleryClient from './GalleryClient';

export default function Gallery({ entry }: { entry: any }) {
  const x = f(entry);
  const images = Array.isArray(x.media) ? x.media.map(media) : [];

  return (
    <Section id="gallery">
      <h2 className="mb-10 text-3xl font-medium text-white md:text-4xl" data-reveal="lines">
        {x.title}
      </h2>
      <GalleryClient images={images} />
    </Section>
  );
}

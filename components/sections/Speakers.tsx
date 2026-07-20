import { f, mapSpeaker } from '@/lib/map';
import Section from '../Section';
import SpeakersClient from './SpeakersClient';

export default function Speakers({ entry }: { entry: any }) {
  const x = f(entry);
  // Publish-driven: render every speaker linked in the published section. The 4th
  // (Modrzewski) now has a real published portrait, so the old front-end portrait gate
  // is gone — visibility is controlled by publishing/unpublishing in Contentful (item 1).
  const speakers = Array.isArray(x.content) ? x.content.map(mapSpeaker) : [];

  return (
    <Section id="speakers">
      {/* No section ↘ here — the design has none for Speakers (review B4). */}
      <h2 className="mb-10 font-grotesk text-[2.5rem] font-normal leading-[0.9] text-creme md:text-[4rem]" data-reveal="lines">
        {x.title}
      </h2>
      <SpeakersClient speakers={speakers} />
    </Section>
  );
}

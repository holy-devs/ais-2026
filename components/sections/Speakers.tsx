import { f, mapSpeaker } from '@/lib/map';
import Section from '../Section';
import SpeakersClient from './SpeakersClient';

export default function Speakers({ entry }: { entry: any }) {
  const x = f(entry);
  const all = Array.isArray(x.content) ? x.content.map(mapSpeaker) : [];
  // Ship only speakers with a real portrait; the not-yet-announced 4th (Modrzewski,
  // placeholder portrait) stays hidden until the image + go-ahead land (F4, OPEN.md).
  const speakers = all.filter(
    (s) => s.portrait.url && !s.portrait.label?.toLowerCase().startsWith('placeholder'),
  );

  return (
    <Section id="speakers">
      {/* No section ↘ here — the design has none for Speakers (review B4). */}
      <h2 className="mb-10 font-grotesk text-3xl font-normal text-creme md:text-4xl" data-reveal="lines">
        {x.title}
      </h2>
      <SpeakersClient speakers={speakers} />
    </Section>
  );
}

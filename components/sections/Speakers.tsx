import { f, mapSpeaker } from '@/lib/map';
import Section from '../Section';
import SpeakersClient from './SpeakersClient';

export default function Speakers({ entry }: { entry: any }) {
  const x = f(entry);
  const speakers = Array.isArray(x.content) ? x.content.map(mapSpeaker) : [];

  return (
    <Section id="speakers">
      <h2 className="mb-10 text-3xl font-medium text-white md:text-4xl" data-reveal="lines">
        {x.title}
      </h2>
      <SpeakersClient speakers={speakers} />
    </Section>
  );
}

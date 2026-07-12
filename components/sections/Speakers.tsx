import { f, mapSpeaker } from '@/lib/map';
import Section from '../Section';
import SpeakersClient from './SpeakersClient';
import { ArrowDownRight } from '../Icons';

export default function Speakers({ entry }: { entry: any }) {
  const x = f(entry);
  const speakers = Array.isArray(x.content) ? x.content.map(mapSpeaker) : [];

  return (
    <Section id="speakers">
      <ArrowDownRight className="text-creme" />
      <h2 className="mb-10 mt-6 font-grotesk text-3xl font-normal text-creme md:text-4xl" data-reveal="lines">
        {x.title}
      </h2>
      <SpeakersClient speakers={speakers} />
    </Section>
  );
}

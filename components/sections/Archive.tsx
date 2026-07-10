import { f, mapPastEvent } from '@/lib/map';
import Section from '../Section';
import ArchiveClient from './ArchiveClient';

export default function Archive({ entry }: { entry: any }) {
  const x = f(entry);
  const events = Array.isArray(x.content) ? x.content.map(mapPastEvent) : [];

  return (
    <Section id="ais-archive">
      <h2 className="mb-10 text-3xl font-medium text-white md:text-4xl" data-reveal="lines">
        {x.title}
      </h2>
      <ArchiveClient events={events} />
    </Section>
  );
}

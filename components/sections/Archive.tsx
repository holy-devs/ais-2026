import { f, mapPastEvent } from '@/lib/map';
import Section from '../Section';
import ArchiveClient from './ArchiveClient';
import { ArrowDownRight } from '../Icons';

export default function Archive({ entry }: { entry: any }) {
  const x = f(entry);
  const events = Array.isArray(x.content) ? x.content.map(mapPastEvent) : [];

  return (
    <Section id="ais-archive">
      <ArrowDownRight className="text-creme" />
      <h2 className="mb-10 mt-6 font-grotesk text-[2.5rem] font-normal leading-[0.9] text-creme md:text-[4rem]" data-reveal="lines">
        {x.title}
      </h2>
      <ArchiveClient events={events} />
    </Section>
  );
}

import { f, pairs, media } from '@/lib/map';
import Section from '../Section';
import RichText from '../RichText';
import Media from '../Media';

export default function VisionStats({ entry }: { entry: any }) {
  const x = f(entry);
  const stats = pairs(x.textList);
  const img = media(x.keyMedia);

  return (
    <Section className="relative">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-4xl italic leading-tight text-creme md:text-5xl" data-reveal="lines">
            {x.title}
          </h2>

          <div className="mt-10 flex gap-12">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-serif text-5xl italic text-white md:text-6xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.15em] text-mid">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Media media={img} className="aspect-[16/10] w-full" />
          <RichText doc={x.text} className="text-sm leading-relaxed text-hi" />
        </div>
      </div>
    </Section>
  );
}

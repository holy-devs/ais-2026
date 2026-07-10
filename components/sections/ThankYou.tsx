import { f } from '@/lib/map';
import Section from '../Section';
import RichText from '../RichText';

export default function ThankYou({ entry }: { entry: any }) {
  const x = f(entry);
  return (
    <Section className="text-center">
      <h2 className="mx-auto max-w-3xl font-serif text-4xl italic leading-tight text-creme md:text-5xl" data-reveal="lines">
        {x.title}
      </h2>
      <RichText doc={x.text} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-hi" />
    </Section>
  );
}

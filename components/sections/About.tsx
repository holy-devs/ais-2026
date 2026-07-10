import { f, mapAction } from '@/lib/map';
import Section from '../Section';
import RichText from '../RichText';

export default function About({ entry }: { entry: any }) {
  const x = f(entry);
  const actions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];

  return (
    <Section id="about-endeavor" className="border-t border-rule">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-3xl font-medium text-white md:text-4xl" data-reveal="lines">{x.title}</h2>
        <div>
          <RichText doc={x.text} className="text-sm leading-relaxed text-hi" />
          {actions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {actions.map((a: any, i: number) => (
                <a
                  key={i}
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase tracking-[0.15em] text-creme underline-offset-4 transition hover:underline"
                >
                  {a.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

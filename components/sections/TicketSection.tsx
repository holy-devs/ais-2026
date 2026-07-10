import { f, mapAction } from '@/lib/map';
import Section from '../Section';
import RichText from '../RichText';

export default function TicketSection({ entry }: { entry: any }) {
  const x = f(entry);
  const actions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];

  return (
    <Section id="ticket-section" className="border-y border-rule bg-e1/40">
      <div className="mx-auto max-w-3xl text-center">
        {x.supertitle && <p className="mb-3 text-sm text-creme" data-reveal="words">{x.supertitle}</p>}
        <h2 className="text-4xl font-medium text-white md:text-5xl" data-reveal="lines">{x.title}</h2>
        <RichText doc={x.text} className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-hi" />

        {actions.length > 0 && (
          <div className="mt-8 flex justify-center gap-3">
            {actions.map((a: any, i: number) => (
              <a
                key={i}
                href={a.href}
                className="bg-creme px-6 py-3 text-sm font-medium text-page transition hover:opacity-90"
              >
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

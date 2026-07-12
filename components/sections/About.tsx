import { f, mapAction } from '@/lib/map';
import RichText from '../RichText';
import { ArrowDownRight } from '../Icons';

export default function About({ entry }: { entry: any }) {
  const x = f(entry);
  const actions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];

  // Heading two tones: first word creme ("About"), remainder white ("Endeavor Greece").
  const title: string = x.title || '';
  const words = title.trim().split(/\s+/);
  const lead = words.shift() || title;
  const rest = words.join(' ');

  return (
    <section id="about-endeavor" className="border-t border-rule px-6 py-16 md:px-9 md:py-20">
      <div className="mx-auto w-full max-w-content">
        {/* heading block (top-left) */}
        <ArrowDownRight className="text-creme" />
        <h2 className="mt-6 font-grotesk text-[2.5rem] font-normal leading-[0.9] md:text-[4rem]" data-reveal="lines">
          <span className="block text-creme">{lead}</span>
          {rest && <span className="block text-white">{rest}</span>}
        </h2>

        {/* body low-left + social right; large gap on desktop, stacked on mobile */}
        <div className="mt-12 flex flex-col gap-8 md:mt-40 md:flex-row md:items-end md:justify-between">
          <RichText doc={x.text} className="max-w-[582px] text-base leading-relaxed text-white md:text-lg" />
          {actions.length > 0 && (
            <ul className="flex flex-row flex-wrap gap-x-5 gap-y-2 text-xs text-white md:flex-col md:items-end md:gap-2 md:text-right">
              {actions.map((a: any) => (
                <li key={a.label}>
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 transition hover:text-creme md:no-underline"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

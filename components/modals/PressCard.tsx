import type { PressDTO } from '@/lib/map';

// Press card — date / title / description / byline (same card pattern as sessions).
export function PressCard({ item }: { item: PressDTO }) {
  return (
    <article className="border border-rule bg-e1 px-3 pb-4 pt-3">
      {item.date && <div className="text-sm font-medium uppercase tracking-[0.1em] text-white/70">{item.date}</div>}
      <h5 className="mt-2 text-xl font-medium leading-6 text-white">{item.title}</h5>
      {item.description && <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>}
      {item.byline && <p className="mt-3 text-xs font-medium text-white">— {item.byline}</p>}
    </article>
  );
}

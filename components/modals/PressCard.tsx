import type { PressDTO } from '@/lib/map';

// Press card (node 9-6786): includes a landscape image at the top (unlike session
// cards), then date / title / description / byline. No `press.image` field yet →
// grey placeholder block. Padding 12 all sides.
// TODO(figma): exact press image aspect (using landscape 16:9 for now).
export function PressCard({ item }: { item: PressDTO }) {
  return (
    <article className="border border-rule bg-e1 p-3">
      <div className="aspect-video w-full bg-e3" role="img" aria-label="placeholder" />
      {item.date && <div className="mt-3 text-sm font-medium uppercase tracking-[0.1em] text-white/70">{item.date}</div>}
      <h5 className="mt-2 text-xl font-medium leading-6 text-white">{item.title}</h5>
      {item.description && <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>}
      {item.byline && <p className="mt-3 text-xs font-medium text-white">— {item.byline}</p>}
    </article>
  );
}

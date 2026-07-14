import type { PressDTO } from '@/lib/map';
import Media from '../Media';

// Press card (node 9-6786): optional landscape image at the top (16:9), then
// date / title / description / byline. Padding 12 all sides.
// M11: the image container renders ONLY when there's an image (the CMS field is
// deferred — no empty navy box until then; it returns on its own once data lands).
// A card with a sourceUrl becomes a link (new tab) with a subtle title-underline hover.
// TODO(figma): exact press image aspect (using landscape 16:9 for now).
export function PressCard({ item }: { item: PressDTO }) {
  const hasImg = !!item.image?.url;
  const body = (
    <>
      {hasImg && <Media media={item.image!} rounded={false} className="aspect-video w-full" />}
      {/* Top margin only when the image sits above — avoids a double gap against p-3. */}
      <div className={hasImg ? 'mt-3' : ''}>
        {item.date && <div className="text-sm font-medium uppercase tracking-[0.1em] text-white/70">{item.date}</div>}
        <h5 className={`${item.date ? 'mt-2 ' : ''}text-xl font-medium leading-6 text-white ${item.sourceUrl ? 'underline-offset-4 group-hover:underline' : ''}`}>
          {item.title}
        </h5>
        {item.description && <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>}
        {item.byline && <p className="mt-3 text-xs font-medium text-white">— {item.byline}</p>}
      </div>
    </>
  );

  const base = 'block border border-rule bg-e1 p-3';
  if (item.sourceUrl) {
    return (
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={`group ${base} transition-colors hover:bg-e2`}>
        {body}
      </a>
    );
  }
  return <article className={base}>{body}</article>;
}

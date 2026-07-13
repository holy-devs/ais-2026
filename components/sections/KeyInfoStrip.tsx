import { f, pairs } from '@/lib/map';
import { Crosshair } from '../Crosshair';

// Title-case a CMS label ("DATE" / "date" → "Date") so the strip reads in the
// design's sentence case regardless of how it's stored (review A2).
function titleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// Key-info strip (review A2): discrete E3 blocks sitting on the page, joined by a
// short dashed connector centered in each gap (shorter than the block). Hover a
// block → fill E3→E2 and its crosshair spins 360°.
export default function KeyInfoStrip({ entry }: { entry: any }) {
  const x = f(entry);
  const items = pairs(x.textList);

  return (
    <section className="bg-page px-6 py-8 md:px-9 md:py-10">
      <div className="mx-auto flex w-full max-w-content flex-wrap items-stretch gap-y-px md:flex-nowrap md:gap-y-0">
        {items.map((it, i) => [
          <div
            key={`b${i}`}
            className="group relative basis-[calc(50%-0.5px)] bg-e3 px-6 py-7 transition-colors duration-300 hover:bg-e2 md:basis-0 md:flex-1 md:py-8"
          >
            <Crosshair
              size={9}
              className="mb-5 text-white transition-transform duration-700 ease-out group-hover:rotate-[360deg]"
            />
            <p className="text-xs tracking-[0.12em] text-creme/60">{titleCase(it.label)}</p>
            <p className="mt-1.5 text-2xl font-medium text-white md:text-3xl">{it.value}</p>
          </div>,
          i < items.length - 1 && (
            <div key={`c${i}`} aria-hidden className="keyinfo-connector hidden self-center md:block" />
          ),
        ])}
      </div>
    </section>
  );
}

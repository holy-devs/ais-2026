import { f, pairs } from '@/lib/map';
import { Crosshair } from '../Crosshair';

export default function KeyInfoStrip({ entry }: { entry: any }) {
  const x = f(entry);
  const items = pairs(x.textList);

  return (
    <section className="bg-e3">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={i}
            className={
              // dashed vertical separator to the left of every cell except the first in its row
              `relative px-6 py-7 md:py-8 ${i % 2 !== 0 ? 'border-l border-dashed border-creme/25' : ''} ` +
              `md:border-l md:border-dashed md:border-creme/25 md:[&:first-child]:border-l-0`
            }
          >
            <Crosshair size={9} className="mb-5 text-white" />
            <p className="text-xs uppercase tracking-[0.15em] text-creme/60">{it.label}</p>
            <p className="mt-1.5 text-2xl font-medium text-white md:text-3xl">{it.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

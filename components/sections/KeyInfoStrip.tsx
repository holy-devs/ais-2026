import { f, pairs } from '@/lib/map';

export default function KeyInfoStrip({ entry }: { entry: any }) {
  const x = f(entry);
  const items = pairs(x.textList);

  return (
    <section className="border-y border-rule">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="border-rule px-6 py-8 [&:not(:nth-child(2n))]:border-r md:border-r md:last:border-r-0 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-mid">{it.label}</p>
            <p className="mt-2 text-2xl font-medium text-white md:text-3xl">{it.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

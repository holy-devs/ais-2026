import { f } from '@/lib/map';

// The keywords micro-element (Frame 348). Config lives on the uniqueComponent
// (variant Settings) json — no dedicated content type, per the model decision.
export default function Keywords({ entry }: { entry: any }) {
  const x = f(entry);
  const keywords: string[] = Array.isArray(x.json?.keywords) ? x.json.keywords : [];
  if (keywords.length === 0) return null;

  return (
    <section id="program" className="border-y border-rule px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
        {keywords.map((k, i) => (
          <span key={k} className="flex items-center gap-6">
            <span className="font-serif text-2xl italic text-creme md:text-3xl" data-reveal="words">
              {k}
            </span>
            {i < keywords.length - 1 && <span className="text-low">·</span>}
          </span>
        ))}
      </div>
    </section>
  );
}

import { f } from '@/lib/map';

// Footer, driven by the uniqueComponent (variant Footer) json.
export default function Footer({ entry }: { entry: any }) {
  const x = f(entry);
  const json = x.json || {};
  const socials: { label: string; url: string }[] = Array.isArray(json.socials) ? json.socials : [];
  const prev: { label: string; anchor: string }[] = Array.isArray(json.previousEditions) ? json.previousEditions : [];

  return (
    <footer className="border-t border-rule bg-e1 px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-lg font-medium text-white">Athens Innovation Summit 2026</p>
            {json.subscribe && (
              <div className="mt-5 flex max-w-sm border border-rule">
                <input
                  type="email"
                  placeholder={json.subscribe.placeholder || 'Email'}
                  className="w-full bg-transparent px-4 py-3 text-sm text-hi outline-none placeholder:text-low"
                />
                <button type="button" className="bg-creme px-4 py-3 text-xs font-medium text-page">
                  {json.subscribe.label || 'Subscribe'}
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-mid">Social</p>
            <ul className="space-y-2">
              {socials.filter((s) => s.url).map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-hi transition hover:text-creme">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-mid">Previous Editions</p>
            <ul className="space-y-2">
              {prev.map((p) => (
                <li key={p.label}>
                  <a href={p.anchor} className="text-sm text-hi transition hover:text-creme">{p.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-rule pt-6 text-xs text-low md:flex-row">
          <span>{json.copyright}</span>
          <span>{json.craftedBy}</span>
        </div>
      </div>
    </footer>
  );
}

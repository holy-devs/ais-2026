import { f, mapAction, media } from '@/lib/map';
import Media from '../Media';

export default function Hero({ entry }: { entry: any }) {
  const x = f(entry);
  const actions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];
  const bg = media(x.keyMedia);

  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Media media={bg} rounded={false} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-page via-page/70 to-page/20" />
      </div>

      <div className="w-full px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto w-full max-w-6xl">
          {x.supertitle && (
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-creme" data-reveal="words">
              {x.supertitle}
            </p>
          )}
          <h1
            className="max-w-4xl text-5xl font-medium leading-[0.95] text-white md:text-7xl lg:text-8xl"
            data-reveal="lines"
          >
            {x.title}
          </h1>

          {actions.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {actions.map((a: any, i: number) => (
                <a
                  key={i}
                  href={a.href}
                  className={
                    a.style === 'Primary'
                      ? 'bg-creme px-6 py-3 text-sm font-medium text-page transition hover:opacity-90'
                      : 'border border-creme/40 px-6 py-3 text-sm font-medium text-creme transition hover:bg-creme hover:text-page'
                  }
                >
                  {a.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

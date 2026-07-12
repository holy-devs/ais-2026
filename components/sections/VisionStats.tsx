import { f, pairs, media } from '@/lib/map';
import FullBleed from '../FullBleed';
import RichText from '../RichText';
import Media from '../Media';
import { ArrowDownRight } from '../Icons';

export default function VisionStats({ entry }: { entry: any }) {
  const x = f(entry);
  const stats = pairs(x.textList);
  const img = media(x.keyMedia);

  return (
    <FullBleed
      media={
        <>
          <Media media={img} rounded={false} className="h-full w-full" />
          {/* Flat, light scrim so the crowd reads across the whole section (per ref). */}
          <div className="absolute inset-0 bg-page/35" />
        </>
      }
      scrim={false}
      contain={false}
      padded={false}
    >
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col px-6 pb-16 pt-20 md:px-9 md:pb-20 md:pt-24">
        <ArrowDownRight className="text-creme" />

        {/* max-w in em scales with the headline size → breaks "Where Athens' Legacy" /
            "Meets Its Next Chapter" like the ref, without orphaning "Chapter". */}
        <h2
          className="mt-8 max-w-[11em] font-editorial text-4xl italic leading-[1.1] text-creme md:text-5xl lg:text-6xl"
          data-reveal="lines"
        >
          {x.title}
        </h2>

        {stats.length > 0 && (
          <div className="mt-14">
            <div className="flex items-end justify-between gap-6">
              {stats.map((s, i) => (
                <div key={i} className={i === stats.length - 1 ? 'text-right' : ''}>
                  <div className="font-editorial italic leading-none text-creme text-[clamp(3rem,8vw,8.5rem)]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
            <hr className="mt-6 border-0 border-t border-white/25" />
          </div>
        )}

        <div className="ml-auto mt-24 max-w-xl md:mt-32">
          <RichText doc={x.text} className="text-sm leading-relaxed text-white/85" />
        </div>
      </div>
    </FullBleed>
  );
}

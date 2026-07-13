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
      <div className="relative mx-auto flex w-full max-w-content flex-col section-y px-6 md:px-9">
        <ArrowDownRight className="text-creme" />

        {/* Upright Founders Regular (F3 ruling). Figma Final UI 2026: 64/52, ls 0,
            container ~594px → drives the "…Legacy / Meets…" wrap. lh ratio 0.8125
            (52/64) scales the smaller breakpoints. */}
        <h2
          className="mt-8 max-w-[594px] font-grotesk text-4xl font-normal leading-[0.8125] tracking-normal text-creme md:text-5xl lg:text-[64px]"
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
          <RichText doc={x.text} className="text-lg leading-relaxed text-white/85 md:text-xl" />
        </div>
      </div>
    </FullBleed>
  );
}

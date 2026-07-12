import { f, media } from '@/lib/map';
import FullBleed from '../FullBleed';
import RichText from '../RichText';
import Media from '../Media';
import { DashedButton } from '../Buttons';
import { ArrowUpRight } from '../Icons';

// Not in the model — hardcoded per ruling (log in OPEN.md). Both open the archive.
const REVISIT = [
  { label: 'Revisit 2025', href: '#ais-archive' },
  { label: 'Revisit 2022', href: '#ais-archive' },
];

export default function ThankYou({ entry }: { entry: any }) {
  const x = f(entry);
  const bg = Array.isArray(x.media) ? x.media.map(media)[0] : undefined;
  return (
    <FullBleed
      // The panel asset carries its own baked gradient — no extra scrim (avoids double-scrim).
      media={bg ? <Media media={bg} rounded={false} className="h-full w-full" /> : undefined}
      scrim={false}
      contain={false}
      padded={false}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-9 md:py-28">
        <div className="max-w-xl">
          {/* Design H1: Founders Grotesk Regular 64/52, creme, hard-broken to 2 lines. */}
          <h2
            className="max-w-[10.5em] font-grotesk text-[2.75rem] font-normal leading-[0.82] tracking-tight text-creme md:text-[4rem]"
            data-reveal="lines"
          >
            {x.title}
          </h2>
          <RichText doc={x.text} className="mt-6 space-y-4 text-sm leading-relaxed text-white/85" />
          <div className="mt-8 flex flex-wrap gap-3">
            {REVISIT.map((b) => (
              <DashedButton key={b.label} href={b.href} label={b.label} icon={<ArrowUpRight />} />
            ))}
          </div>
        </div>
      </div>
    </FullBleed>
  );
}

import { f } from '@/lib/map';
import FullBleed from '../FullBleed';
import RichText from '../RichText';
import { DashedButton } from '../Buttons';
import { ArrowUpRight } from '../Icons';

// TEMPORARY background — cropped from Desktop.png (no such asset in the CMS). See
// OPEN.md; replace with the real panel photo wired into the thank-you entry.
const TEMP_BG = '/thankyou-temp.png';

// Not in the model — hardcoded per ruling (log in OPEN.md). Both open the archive.
const REVISIT = [
  { label: 'Revisit 2025', href: '#ais-archive' },
  { label: 'Revisit 2022', href: '#ais-archive' },
];

export default function ThankYou({ entry }: { entry: any }) {
  const x = f(entry);
  return (
    <FullBleed
      media={
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TEMP_BG} alt="" className="h-full w-full object-cover object-center" />
          {/* Flat 35% scrim so the warm scene reads across the whole section (per ref). */}
          <div className="absolute inset-0 bg-page/35" />
        </>
      }
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

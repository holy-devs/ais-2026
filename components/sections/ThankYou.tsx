import { f, media } from '@/lib/map';
import { assetUrl, assetTitle } from '@/lib/contentful';
import FullBleed from '../FullBleed';
import RichText from '../RichText';
import Media from '../Media';
import { GlassButton } from '../Buttons';
import { ArrowUpRight } from '../Icons';

// Not in the model — hardcoded per ruling (log in OPEN.md). Both open the archive.
const REVISIT = [
  { label: 'Revisit 2025', href: '#ais-archive' },
  { label: 'Revisit 2022', href: '#ais-archive' },
];

export default function ThankYou({ entry }: { entry: any }) {
  const x = f(entry);
  const bg = Array.isArray(x.media) ? x.media.map(media)[0] : undefined;
  // Optional mobile-only override (mediaMobile — single Asset). Served at native width
  // (no ?w upscale), mirroring the hero's heroMediaMobile pattern. Absent/unresolved →
  // the desktop asset stays on every breakpoint, byte-identical to before this field.
  const bgMobile = x.mediaMobile
    ? { url: assetUrl(x.mediaMobile), label: assetTitle(x.mediaMobile) }
    : undefined;

  // With a mobile asset set, a <picture> swaps in the mobile crop below md (768px) and
  // keeps the desktop asset above it — only the matching candidate downloads. Same
  // center 25% framing on both so the seated subjects stay in frame. Without it, the
  // original single-<Media> background renders unchanged.
  const background = bg
    ? bgMobile?.url
      ? (
        <picture className="block h-full w-full">
          <source media="(min-width: 768px)" srcSet={bg.url} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgMobile.url}
            alt={bg.label}
            className="h-full w-full object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
        </picture>
      )
      : <Media media={bg} rounded={false} position="center 25%" className="h-full w-full" />
    : undefined;

  return (
    <FullBleed
      // The panel asset carries its own baked gradient — no extra scrim (avoids double-scrim).
      // object-position top keeps seated subjects' heads in frame (review B7 / OWNER-2).
      media={background}
      scrim={false}
      contain={false}
      padded={false}
    >
      {/* Min 640px tall panel, content vertically centered (review B7). */}
      <div className="mx-auto flex min-h-[640px] w-full max-w-content items-center px-6 py-16 md:px-9">
        <div className="max-w-xl">
          {/* Design H1: Founders Grotesk Regular 64/52, creme, hard-broken to 2 lines. */}
          <h2
            className="max-w-[10.5em] font-grotesk text-[2.5rem] font-normal leading-[0.9] text-creme md:text-[4rem]"
            data-reveal="lines"
          >
            {x.title}
          </h2>
          <RichText doc={x.text} className="mt-6 space-y-4 text-lg leading-relaxed text-white/85 md:text-xl" />
          <div className="mt-8 flex flex-wrap gap-3">
            {REVISIT.map((b) => (
              <GlassButton key={b.label} variant="solid" href={b.href} label={b.label} icon={<ArrowUpRight />} />
            ))}
          </div>
        </div>
      </div>
    </FullBleed>
  );
}

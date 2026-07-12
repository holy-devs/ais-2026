import { ctId, f } from '@/lib/map';
import Hero from './sections/Hero';
import KeyInfoStrip from './sections/KeyInfoStrip';
import VisionStats from './sections/VisionStats';
import Speakers from './sections/Speakers';
import ThankYou from './sections/ThankYou';
import Gallery from './sections/Gallery';
import Archive from './sections/Archive';
import TicketSection from './sections/TicketSection';
import Partners from './sections/Partners';
import About from './sections/About';
import Keywords from './Keywords';

// section.variant -> component. Both partner rows share the Logo Assets variant.
const SECTION_MAP: Record<string, (p: { entry: any }) => any> = {
  Hero,
  'Key Info': KeyInfoStrip,
  Stats: VisionStats,
  People: Speakers,
  Standard: ThankYou,
  Gallery,
  Archive,
  CTA: TicketSection,
  'Logo Assets': Partners,
  About,
};

/**
 * Renders one item of page.content by type. `section` entries dispatch on variant;
 * a uniqueComponent with variant Settings renders the inline Keywords strip.
 * Menu/Footer uniqueComponents are handled separately by the page shell.
 */
export default function SectionRenderer({ entry }: { entry: any }) {
  const type = ctId(entry);

  if (type === 'uniqueComponent') {
    if (f(entry).variant === 'Settings') return <Keywords entry={entry} />;
    return null; // Menu / Footer handled by the page shell
  }

  if (type === 'section') {
    const variant = f(entry).variant;
    const Comp = SECTION_MAP[variant];
    if (!Comp) {
      return (
        <div className="mx-auto max-w-content px-6 py-8 text-xs text-low">
          [unmapped section variant: {String(variant)}]
        </div>
      );
    }
    return <Comp entry={entry} />;
  }

  return null;
}

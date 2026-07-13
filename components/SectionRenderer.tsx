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
const SECTION_MAP: Record<string, (p: { entry: any; ticketsEnabled?: boolean }) => any> = {
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
export default function SectionRenderer({ entry, ticketsEnabled = true }: { entry: any; ticketsEnabled?: boolean }) {
  const type = ctId(entry);

  if (type === 'uniqueComponent') {
    // Keywords/ticker strip is out of the v5.0 UI (review B8); hiding it also drops
    // the orphaned #program anchor (F1). Component kept for a possible future revival.
    const KEYWORDS_ENABLED = false;
    if (f(entry).variant === 'Settings') return KEYWORDS_ENABLED ? <Keywords entry={entry} /> : null;
    return null; // Menu / Footer handled by the page shell
  }

  if (type === 'section') {
    const variant = f(entry).variant;
    // Organisers/Sponsors is out this cycle (official sponsor logos arrive next year;
    // v5.0 also has no partners section). Front-end gate only — Contentful untouched.
    // Flip to true to bring it back; also re-fix the logo assets first (see OPEN.md).
    const PARTNERS_ENABLED = false;
    if (variant === 'Logo Assets' && !PARTNERS_ENABLED) return null;
    // Ticket section (variant CTA) disappears entirely when tickets are off.
    if (variant === 'CTA' && !ticketsEnabled) return null;
    const Comp = SECTION_MAP[variant];
    if (!Comp) {
      return (
        <div className="mx-auto max-w-content px-6 py-8 text-xs text-low">
          [unmapped section variant: {String(variant)}]
        </div>
      );
    }
    return <Comp entry={entry} ticketsEnabled={ticketsEnabled} />;
  }

  return null;
}

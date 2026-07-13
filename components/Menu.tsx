import { f } from '@/lib/map';
import Nav from './Nav';

// Top navigation + side menu, driven by the uniqueComponent (variant Menu) json.
export default function Menu({ entry, ticketsEnabled = true }: { entry: any; ticketsEnabled?: boolean }) {
  const x = f(entry);
  const json = x.json || {};
  const nav = Array.isArray(json.navigation) ? json.navigation : [];
  // When tickets are off, drop the CTA button entirely (Nav also drops the
  // Request Tickets nav link via the same flag).
  const cta = ticketsEnabled ? json.cta : undefined;
  return <Nav nav={nav} cta={cta} ticketsEnabled={ticketsEnabled} />;
}

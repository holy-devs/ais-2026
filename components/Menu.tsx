import { f } from '@/lib/map';
import Nav from './Nav';

// Top navigation + side menu, driven by the uniqueComponent (variant Menu) json.
export default function Menu({ entry }: { entry: any }) {
  const x = f(entry);
  const json = x.json || {};
  const nav = Array.isArray(json.navigation) ? json.navigation : [];
  const cta = json.cta;
  return <Nav nav={nav} cta={cta} />;
}

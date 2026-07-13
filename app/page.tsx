import { getHomePage } from '@/lib/contentful';
import { ctId, f } from '@/lib/map';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import SectionRenderer from '@/components/SectionRenderer';

export const revalidate = 60; // ISR: re-fetch published content every 60s

export default async function Home() {
  const page = await getHomePage();
  if (!page) {
    return <main className="grid min-h-screen place-items-center text-mid">No content found for slug “home”.</main>;
  }

  const content: any[] = Array.isArray(f(page).content) ? f(page).content : [];

  // Pull the Menu / Footer uniqueComponents out of the flow; render the rest in order.
  const isUC = (e: any, v: string) => ctId(e) === 'uniqueComponent' && f(e).variant === v;
  const menu = content.find((e) => isUC(e, 'Menu'));
  const footer = content.find((e) => isUC(e, 'Footer'));
  const flow = content.filter((e) => !isUC(e, 'Menu') && !isUC(e, 'Footer'));

  // Footer's Navigation column consumes the same CMS menu data the nav uses (ruling #4).
  const menuNav = menu ? (f(menu).json?.navigation ?? []) : [];

  // Site-wide ticket CTA toggle (Menu uniqueComponent boolean field; default true).
  // One flip hides the header/mobile CTA, the hero Get Tickets, the ticket section,
  // and the Request Tickets nav item everywhere it appears.
  const ticketsEnabled = menu ? (f(menu).ticketsEnabled ?? true) : true;

  return (
    <>
      {menu && <Menu entry={menu} ticketsEnabled={ticketsEnabled} />}
      <main>
        {flow.map((entry) => (
          <SectionRenderer key={entry.sys.id} entry={entry} ticketsEnabled={ticketsEnabled} />
        ))}
      </main>
      {footer && <Footer entry={footer} nav={menuNav} ticketsEnabled={ticketsEnabled} />}
    </>
  );
}

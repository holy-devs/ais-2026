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

  return (
    <>
      {menu && <Menu entry={menu} />}
      <main>
        {flow.map((entry) => (
          <SectionRenderer key={entry.sys.id} entry={entry} />
        ))}
      </main>
      {footer && <Footer entry={footer} />}
    </>
  );
}

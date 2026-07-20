import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ModalProvider from '@/components/modals/ModalProvider';
import RevealController from '@/components/RevealController';
import { getPageMeta, assetUrl } from '@/lib/contentful';
import { resolveSeo } from '@/lib/seo';

// Licensed faces, self-hosted. NOTE: the Founders Grotesk files are Klim TRIAL
// ("Test Founders Grotesk") — production licence to be confirmed (see OPEN.md);
// swapping to the licensed woff2 is a file drop-in (same weights/paths).
const grotesk = localFont({
  src: [
    { path: './fonts/founders-grotesk-regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/founders-grotesk-medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-grotesk-face',
  display: 'swap',
});
const editorial = localFont({
  src: [{ path: './fonts/pp-editorial-old-italic.woff2', weight: '400', style: 'italic' }],
  variable: '--font-editorial-face',
  display: 'swap',
});

// SEO is now CMS-driven: title / description / og:image come from the home `page`
// entry (metaTitle / metaDescription / ogImage), each falling back to the historic
// hardcoded value when the field is empty. Icons / manifest / theme are unchanged.
export async function generateMetadata(): Promise<Metadata> {
  let fields: Record<string, unknown> = {};
  try {
    fields = (await getPageMeta())?.fields ?? {};
  } catch {
    // On any delivery error, resolveSeo() returns the hardcoded fallbacks.
  }
  const { title, description, ogImageUrl } = resolveSeo({
    metaTitle: fields.metaTitle,
    metaDescription: fields.metaDescription,
    ogImageUrl: assetUrl(fields.ogImage as never, 1200),
  });

  return {
    title,
    description,
    // 2026 favicon bundle (realfavicongenerator), served from public/. Next emits the
    // <link> tags — do not hand-write them.
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#010010',
};

// Runs before paint: gates the CSS reveal-hide (no-JS shows content) and flags
// reduced-motion so RevealController can skip animations.
// Adds `gsap-on` (which hides [data-reveal] until revealed) + `reduced` for reduced
// motion. Safety net: if reveals never initialize within 2.5s (JS error / hydration
// failure / RevealController never mounts), fall back to `reduced` so ALL content
// shows regardless — text can never be left hidden by a dead client.
const gsapInit = `(function(){var d=document.documentElement;d.classList.add('gsap-on');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');}catch(e){}setTimeout(function(){if(!d.classList.contains('reveal-init'))d.classList.add('reduced');},2500);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${editorial.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: gsapInit }} />
      </head>
      <body className="bg-page font-sans text-hi">
        <ModalProvider>
          {children}
          <RevealController />
        </ModalProvider>
      </body>
    </html>
  );
}

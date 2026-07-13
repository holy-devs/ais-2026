import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ModalProvider from '@/components/modals/ModalProvider';
import RevealController from '@/components/RevealController';

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

export const metadata: Metadata = {
  title: 'Athens Innovation Summit 2026',
  description: 'Athens Innovation Summit 2026 — July 16, 2026, Pnyx, Athens. A global forum on AI, democracy, and human progress by Endeavor Greece.',
};

// Runs before paint: gates the CSS reveal-hide (no-JS shows content) and flags
// reduced-motion so RevealController can skip animations.
const gsapInit = `(function(){var d=document.documentElement;d.classList.add('gsap-on');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');}catch(e){}})();`;

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

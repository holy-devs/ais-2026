import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import ModalProvider from '@/components/modals/ModalProvider';
import RevealController from '@/components/RevealController';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-instrument', display: 'swap' });

export const metadata: Metadata = {
  title: 'Athens Innovation Summit 2026',
  description: 'Athens Innovation Summit 2026 — July 16, 2026, Pnyx, Athens. A global forum on AI, democracy, and human progress by Endeavor Greece.',
};

// Runs before paint: gates the CSS reveal-hide (no-JS shows content) and flags
// reduced-motion so RevealController can skip animations.
const gsapInit = `(function(){var d=document.documentElement;d.classList.add('gsap-on');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable}`} suppressHydrationWarning>
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

'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Mounted once at the root. Applies SplitText line/word scroll-reveals to every
 * [data-reveal] element. Respects prefers-reduced-motion (the inline head script
 * adds `reduced`, and we leave content visible).
 *
 * Runs AFTER document.fonts.ready: SplitText must measure line breaks with the real
 * (self-hosted, async) fonts loaded, otherwise it can split/measure wrongly and leave
 * [data-reveal] elements — hidden by CSS until revealed — stuck at opacity 0. A
 * try/catch safety net force-shows the content if anything throws, so text is never
 * left invisible.
 */
export default function RevealController() {
  useGSAP(() => {
    const root = document.documentElement;
    if (root.classList.contains('reduced')) return; // reduced motion: content already visible

    const splits: SplitText[] = [];
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    let hasRun = false;

    const run = () => {
      if (cancelled || hasRun) return;
      hasRun = true;
      try {
        ctx = gsap.context(() => {
          const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
          els.forEach((el) => {
            const mode = el.getAttribute('data-reveal') === 'words' ? 'words' : 'lines';
            const split = new SplitText(el, { type: mode, linesClass: 'reveal-line', wordsClass: 'reveal-word' });
            splits.push(split);
            const units = mode === 'words' ? split.words : split.lines;
            gsap.set(el, { opacity: 1 });
            gsap.from(units, {
              yPercent: 110,
              opacity: 0,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.06,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
          });
          ScrollTrigger.refresh();
        });
      } catch (err) {
        // Safety net: never leave revealed text stuck hidden.
        gsap.set('[data-reveal]', { opacity: 1 });
        // eslint-disable-next-line no-console
        console.error('[reveal] init failed — content shown without animation', err);
      }
    };

    // Run after fonts are ready (correct SplitText measurement) OR a 1.5s cap so a
    // slow/failed font load can never leave text hidden. `hasRun` makes it run once.
    const ready = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
    if (ready && typeof (ready as Promise<unknown>).then === 'function') {
      ready.then(run);
      setTimeout(run, 1500);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      splits.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  return null;
}

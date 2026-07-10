'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Mounted once at the root. Applies SplitText line/word scroll-reveals to every
 * [data-reveal] element per the animation directive. Respects prefers-reduced-motion
 * (the inline head script adds `reduced`, and we simply leave content visible).
 */
export default function RevealController() {
  useGSAP(() => {
    const root = document.documentElement;
    if (root.classList.contains('reduced')) return; // reduced motion: no reveals

    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    const splits: SplitText[] = [];

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
    return () => splits.forEach((s) => s.revert());
  }, []);

  return null;
}

'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { Ticker } from './Plate';

/**
 * Slides over the hero, then pins while the manifesto "reads itself" word by word
 * (Apple-style scrubbed text). Replace the copy with your own house rules.
 */
export default function Manifesto() {
  const root = useRef(null);
  const body = useRef(null);
  const text = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const split = SplitText.create(text.current, { type: 'words', wordsClass: 'mf-word' });

    gsap.timeline({
      scrollTrigger: {
        trigger: body.current,
        start: 'top top',
        end: '+=160%',
        pin: true,
        scrub: 0.5,
      },
    })
      .fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none' })
      .fromTo('.mf-sign', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

    return () => split.revert();
  }, { scope: root });

  return (
    <section className="manifesto slide-card" ref={root} id="kitchen">
      <Ticker />
      <div className="manifesto-body" ref={body}>
        <div className="manifesto-eyebrow">— House rules —</div>
        <p className="manifesto-text" ref={text}>
          We&apos;re a kitchen, not a factory. Every idea is cooked to order — slow where it matters,
          fast where it counts. No reheated trends. No microwaved content. Just honest work, served hot.
        </p>
        <div className="mf-sign">— The Chefs, Adilicious</div>
      </div>
    </section>
  );
}

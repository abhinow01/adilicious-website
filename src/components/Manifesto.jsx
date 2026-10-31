'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { Ticker } from './Plate';
import { useSmootherReady } from './SmoothScroll';

/**
 * Slides over the hero, then pins while the manifesto "reads itself" word by word
 * (Apple-style scrubbed text). Copy comes from the CMS (Home page → House rules).
 */
export default function Manifesto({ eyebrow, text: copy, signature, ticker }) {
  const ready = useSmootherReady();
  const root = useRef(null);
  const body = useRef(null);
  const text = useRef(null);

  useGSAP(() => {
    if (!ready || prefersReducedMotion()) return;
    const split = SplitText.create(text.current, { type: 'words', wordsClass: 'mf-word', aria: 'none' });

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
  }, { scope: root, dependencies: [ready, copy] });

  return (
    <section className="manifesto slide-card" ref={root} id="kitchen">
      <Ticker items={ticker} />
      <div className="manifesto-body" ref={body}>
        <div className="manifesto-eyebrow">{eyebrow}</div>
        <p className="manifesto-text" ref={text}>
          {copy}
        </p>
        <div className="mf-sign">{signature}</div>
      </div>
    </section>
  );
}

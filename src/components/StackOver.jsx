'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

/**
 * "Slide-over" stacking effect.
 *
 * Wrap a section in <StackOver>. When you scroll past it, it is pinned in place (without adding
 * scroll space) while the NEXT section — which must have the `slide-card` class — slides up over
 * it like a card. The covered section sinks back (scales down, darkens, rounds its corners), which
 * is what sells the depth.
 *
 * Sections taller than the viewport are pinned when their bottom reaches the bottom of the
 * screen, so nothing is hidden before the user has seen it.
 */
export default function StackOver({ children, className = '', scale = 0.9, dim = 0.6, radius = 32, ...rest }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const shade = useRef(null);

  useGSAP(() => {
    const el = outer.current;
    const isTall = () => el.offsetHeight > window.innerHeight + 1;
    const reduce = prefersReducedMotion();

    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: () => (isTall() ? 'bottom bottom' : 'top top'),
        end: () => '+=' + window.innerHeight,
        pin: true,
        pinSpacing: false,   // <- the next section scrolls OVER this one instead of after it
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(inner.current,
        {
          scale: 1,
          borderRadius: 0,
          // keep the visible part of a tall section centred while it shrinks
          transformOrigin: () => `50% ${isTall() ? el.offsetHeight - window.innerHeight / 2 : el.offsetHeight / 2}px`,
        },
        { scale: reduce ? 1 : scale, borderRadius: radius, ease: 'none' }, 0)
      .fromTo(shade.current, { opacity: 0 }, { opacity: dim, ease: 'none' }, 0);
  }, { scope: outer });

  return (
    <div ref={outer} className={'stack-over ' + className} {...rest}>
      <div ref={inner} className="stack-over-inner">
        {children}
        <div ref={shade} className="stack-over-shade" aria-hidden="true" />
      </div>
    </div>
  );
}

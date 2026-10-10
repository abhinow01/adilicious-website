'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollSmoother, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';

/**
 * Wraps the scrolling content in GSAP ScrollSmoother (the "buttery" momentum scroll that makes
 * scrubbed animations feel like a video timeline).
 *
 * Rules that come with it:
 *  - position: fixed elements (nav, loader, modals) must live OUTSIDE this component.
 *  - position: sticky does not work inside it — use ScrollTrigger `pin` instead.
 *  - The smoother has to exist before any ScrollTrigger is created, so children only render
 *    once it is ready.
 */
export default function SmoothScroll({ children }) {
  const wrapper = useRef(null);
  const content = useRef(null);
  const [ready, setReady] = useState(false);

  useGSAP(() => {
    let smoother;
    if (!prefersReducedMotion()) {
      smoother = ScrollSmoother.create({
        wrapper: wrapper.current,
        content: content.current,
        smooth: 1.1,          // seconds it takes to "catch up" to the native scroll position
        effects: true,        // enables data-speed / data-lag attributes for parallax
        smoothTouch: 0.1,     // a touch of smoothing on phones, mostly native feel
      });
    }
    setReady(true);
    return () => smoother?.kill();
  }, []);

  // Re-measure every trigger once web fonts and the videos' metadata change layout.
  useEffect(() => {
    if (!ready) return;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, [ready]);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {ready ? children : null}
      </div>
    </div>
  );
}

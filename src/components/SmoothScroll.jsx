'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ScrollSmoother, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';

const SmootherReady = createContext(false);

/**
 * Components that create ScrollTriggers wait for this: ScrollSmoother must exist before any
 * ScrollTrigger is created. Usage: `const ready = useSmootherReady()` and in useGSAP:
 * `if (!ready) return;` with `dependencies: [ready]`.
 */
export const useSmootherReady = () => useContext(SmootherReady);

/**
 * Wraps the scrolling content in GSAP ScrollSmoother (the "buttery" momentum scroll that makes
 * scrubbed animations feel like a video timeline).
 *
 * The content is always rendered, including in the server HTML, so search engines and slow
 * connections get the full page. Only the animations wait for the smoother to start.
 *
 * `enabled` starts the smoother and the animations. The home page turns it on when the intro
 * loader finishes, so this heavy JavaScript runs at the same moment as in the original design
 * instead of competing with the initial page load. Until then scrolling is held still.
 *
 * Rules that come with it:
 *  - position: fixed elements (nav, loader, modals) must live OUTSIDE this component.
 *  - position: sticky does not work inside it — use ScrollTrigger `pin` instead.
 */
export default function SmoothScroll({ children, enabled = true }) {
  const wrapper = useRef(null);
  const content = useRef(null);
  const smoother = useRef(null);
  const [ready, setReady] = useState(false);

  useGSAP(() => {
    if (!enabled) return;
    if (!prefersReducedMotion()) {
      smoother.current = ScrollSmoother.create({
        wrapper: wrapper.current,
        content: content.current,
        smooth: 1.1,          // seconds it takes to "catch up" to the native scroll position
        effects: true,        // enables data-speed / data-lag attributes for parallax
        smoothTouch: 0.1,     // a touch of smoothing on phones, mostly native feel
      });
    }
    setReady(true);
    return () => {
      smoother.current?.kill();
      smoother.current = null;
    };
  }, { dependencies: [enabled] });

  // Hold the page still until enabled (the intro loader covers it meanwhile).
  useEffect(() => {
    if (enabled) return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    return () => { root.style.overflow = ''; };
  }, [enabled]);

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
        <SmootherReady.Provider value={ready}>{children}</SmootherReady.Provider>
      </div>
    </div>
  );
}

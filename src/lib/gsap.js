'use client';

// Single place where GSAP + plugins are registered.
// Import everything GSAP-related from here: `import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'`
// (Since GSAP 3.13 every plugin — ScrollSmoother, SplitText, etc. — ships free in the `gsap` package.)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, useGSAP);
  // Mobile browsers resize the viewport when the URL bar hides; don't recalculate every trigger for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, useGSAP };

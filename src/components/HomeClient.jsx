'use client';

import { useState, useEffect, useRef } from 'react';
import HeroCarousel from './HeroCarousel';
import { Reservation } from './Plate';
import PlateSection from '@/components/PlateSection';
import Manifesto from '@/components/Manifesto';
import SayHello from '@/components/SayHello';
import SmoothScroll from '@/components/SmoothScroll';
import StackOver from '@/components/StackOver';
import { ScrollSmoother } from '@/lib/gsap';
import Image from 'next/image';
import useIsMobile from '@/hooks/useIsMobile';
import HangingSignLoader from '@/components/loader';
const TWEAK_DEFAULTS = { fontPreset: 'Classic', tableColor: '#b8332b' };

const FONT_PRESETS = {
  Display: {
    display: "'Anton', 'Oswald', sans-serif",
    serif:   "'Instrument Serif', 'Georgia', serif",
    mono:    "'DM Mono', 'Menlo', monospace",
    body:    "'Instrument Serif', serif",
  },
  Modern: {
    display: "'Inter', system-ui, sans-serif",
    serif:   "'Inter', system-ui, sans-serif",
    mono:    "'JetBrains Mono', 'Menlo', monospace",
    body:    "'Inter', system-ui, sans-serif",
  },
  Classic: {
    display: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    mono:    "'Menlo', 'Courier New', monospace",
    body:    "Georgia, 'Times New Roman', serif",
  },
};

function shade(hex, amt) {
  const c = hex.replace('#', '');
  const num = parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * amt)));
  r = f(r); g = f(g); b = f(b);
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// How long the intro loader holds the stage before the page "opens". Unchanged from the
// original design; it now starts the hero and unlocks scrolling instead of mounting the page.
const INTRO_MS = 4000;

/**
 * The interactive shell of the home page. All copy comes from the CMS via props
 * (fetched on the server in app/page.js).
 */
export default function HomeClient({ home, settings, isDraftMode = false }) {
  const [t] = useState(TWEAK_DEFAULTS);
  const [showLoader, setShowLoader] = useState(true);
  const [isDarkLogo, setIsDarkLogo] = useState(false);
  const reserveRef = useRef(null);
  const isMobile = useIsMobile();
  const [showNav, setShowNav] = useState(true);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const preset = FONT_PRESETS[t.fontPreset] || FONT_PRESETS.Display;
    const r = document.documentElement.style;
    r.setProperty('--font-display', preset.display);
    r.setProperty('--font-serif', preset.serif);
    r.setProperty('--font-mono', preset.mono);
    document.body.style.fontFamily = preset.body;
  }, [t.fontPreset]);

  useEffect(() => {
    const c = t.tableColor || '#b8332b';
    document.documentElement.style.setProperty('--red', c);
    const dim = shade(c, -0.25);
    const dark = shade(c, -0.45);
    document.documentElement.style.setProperty('--red-deep', dim);
    document.documentElement.style.setProperty('--red-dark', dark);
  }, [t.tableColor]);

  useEffect(() => {
    const handleScroll = () => {
      if (reserveRef.current) {
        const rect = reserveRef.current.getBoundingClientRect();
        setIsDarkLogo(rect.top < 100);
      }
      setShowNav(window.scrollY <= 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHash = (e) => {
    const id = e.currentTarget.getAttribute('href');
    const target = id && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(target, true, 'top top');
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), INTRO_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
  <>

  <div className='relative'>
    {showLoader && (
        <HangingSignLoader
          logoSrc="/assets/logo-white.png"
          companyName={settings.siteName}
          onFinished={() => setShowLoader(false)} // ONLY this unmounts the loader
        />
      )}
  <div>
    {/* The one h1 of the page: names the agency for search engines and screen readers. */}
    <h1 className="sr-only">{settings.siteName} — {settings.tagline}</h1>

<nav className={`nav ${showNav ? 'nav-visible' : 'nav-hidden'}`}>
  <div className="nav-logo">
          <Image
            src={isDarkLogo ? "/assets/logo-dark.png" : "/assets/logo-cream-new.png"}
            alt={settings.siteName}
            width={isMobile ? 50 : 75}
            height={isMobile ? 50 : 75}
            priority
          />
        </div>
        <div className="nav-links">
          <a href="#kitchen" onClick={scrollToHash}>Kitchen</a>
          <a href="#menu" onClick={scrollToHash}>Menu</a>
          <a href="#reserve" onClick={scrollToHash}>Book</a>
          <a href="#hello" onClick={scrollToHash}>Say hello</a>
        </div>
        <a className="nav-cta" href="#reserve" onClick={scrollToHash}>Reserve a Table</a>
      </nav>

      {/* fixed elements (nav, loader) stay outside SmoothScroll */}
      <SmoothScroll enabled={introDone}>
        <StackOver>
          <HeroCarousel slides={home.hero?.slides ?? []} reelLabel={home.hero?.reelLabel} active={introDone} />
        </StackOver>
        <Manifesto {...home.manifesto} ticker={home.ticker} />
        <PlateSection {...home.menu} />
        <StackOver>
          <div ref={reserveRef}>
            <Reservation {...home.reservation} contacts={settings.contacts} />
          </div>
        </StackOver>
        <SayHello {...home.hello} />
        {/* <Footer {...settings.footer} siteName={settings.siteName} /> */}
      </SmoothScroll>
      </div>
      </div>

      {isDraftMode && (
        <a href="/api/draft-mode/disable" className="draft-badge">Previewing drafts · Exit</a>
      )}
    </>
  );
}

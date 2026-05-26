'use client';

import { useState, useEffect, useRef } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import { Ticker, PlateSection, Reservation, Footer } from '../components/Plate';

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

export default function Home() {
  const [t, setTweak] = useState(TWEAK_DEFAULTS);
  const [isDarkLogo, setIsDarkLogo] = useState(false);
  const reserveRef = useRef(null);

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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <img 
            src={isDarkLogo ? "/assets/logo-dark.png" : "/assets/logo-cream-new.png"} 
            alt="Adilicious" 
          />
        </div>
        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#kitchen">Kitchen</a>
          <a href="#reviews">Reviews</a>
          <a href="#reel">The Reel</a>
        </div>
        <a className="nav-cta" href="#reserve">Reserve a Table</a>
      </nav>

      <HeroCarousel />
      <Ticker />
      <PlateSection />
      <div ref={reserveRef}>
        <Reservation />
      </div>
      <Footer />
    </>
  );
}

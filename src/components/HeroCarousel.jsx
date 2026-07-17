'use client';

import { useState, useEffect, useRef } from 'react';

const HERO_SLIDES = [
  {
    video: '/videos/appetizers.mp4',
    tag: '— Now Serving · Spot 01 —',
    title: <>The Crave<br/><em>Manifesto</em></>,
    client: 'For Solano Hot Sauce',
    role: 'Concept, Direction & Edit',
  },
  {
    video: '/videos/dessert.mp4',
    tag: '— Now Serving · Spot 03 —',
    title: <>Sweet on<br/><em>Strangers</em></>,
    client: 'For Marigold Confections',
    role: 'Brand Anthem',
  },
  {
    video: '/videos/dessert.mp4',
    tag: '— Now Serving · Spot 04 —',
    title: <>Lights, Or<br/><em>Whatever</em></>,
    client: 'For Bayside Studios',
    role: 'Series Identity',
  },
];

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const total = HERO_SLIDES.length;
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play()?.catch(() => {});
  }, [idx]);
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % total);
    }, 7000);
    return () => clearTimeout(timerRef.current);
  }, [idx, total]);

  const go = (i) => {
    clearTimeout(timerRef.current);
    setIdx(((i % total) + total) % total);
  };

  return (
    <section className="hero">
      <div className="hero-stage">
        <div className="hero-slide active">
          <div className="hero-slide-canvas">
            <video
              key={idx}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translate(-50%, -50%)',
                objectFit: 'cover'
              }}
            >
              <source
                src={HERO_SLIDES[idx].video}
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>

      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i}
            className={"hero-dot " + (i === idx ? 'active' : '')}
            onClick={() => go(i)}
            aria-label={`Show ad ${i + 1}`}></button>
        ))}
      </div>

      <div className="hero-overlay">
        <div className="hero-tag">{HERO_SLIDES[idx].tag}</div>
        <h1 className="hero-title">{HERO_SLIDES[idx].title}</h1>
        <div className="hero-meta">
          <div className="hero-client">
            {HERO_SLIDES[idx].client}
            <span>{HERO_SLIDES[idx].role}</span>
          </div>
          <div className="hero-client" style={{textAlign: 'right'}}>
            Reel · 2024–26
            <span style={{opacity: 0.6}}>{String(idx + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
          </div>
        </div>
      </div>

      <div className="hero-progress">
        {HERO_SLIDES.map((_, i) => (
          <div key={i + '-' + idx}
            className={"hero-progress-bar " + (i === idx ? 'active' : i < idx ? 'done' : '')}>
            <span></span>
          </div>
        ))}
      </div>
    </section>
  );
}

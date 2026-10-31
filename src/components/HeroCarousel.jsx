'use client';

import { useState, useEffect, useRef } from 'react';
import { renderDisplayText } from '@/sanity/text';
import { sanityImageUrl } from '@/sanity/image';

/**
 * @param {{ slides: Array, reelLabel?: string, active: boolean }} props
 * `active` turns on once the intro loader has finished: the video starts loading and the slide
 * timer starts then, exactly as before the CMS (when the hero only mounted at that moment).
 * Before that, the slide text is still in the HTML for search engines.
 */
export default function HeroCarousel({ slides, reelLabel, active }) {
  const [idx, setIdx] = useState(0);
  const total = slides.length;
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const slide = slides[idx] ?? {};

  useEffect(() => {
    videoRef.current?.play()?.catch(() => {});
  }, [idx, active]);
  useEffect(() => {
    if (!active || total < 2) return;
    timerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % total);
    }, 7000);
    return () => clearTimeout(timerRef.current);
  }, [idx, total, active]);

  const go = (i) => {
    clearTimeout(timerRef.current);
    setIdx(((i % total) + total) % total);
  };

  const poster = sanityImageUrl(slide.poster, { width: 1920, quality: 70 });

  return (
    <section className="hero">
      <div className="hero-stage">
        <div className="hero-slide active">
          <div className="hero-slide-canvas">
            {active && slide.videoSrc && (
            <video
              ref={videoRef}
              key={idx}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={poster}
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
                src={slide.videoSrc}
                type="video/mp4"
              />
            </video>
            )}
          </div>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button key={s._key ?? i}
            className={"hero-dot " + (i === idx ? 'active' : '')}
            onClick={() => go(i)}
            aria-label={`Show ad ${i + 1}`}></button>
        ))}
      </div>

      <div className="hero-overlay">
        <div className="hero-tag">{slide.tag}</div>
        <h2 className="hero-title">{renderDisplayText(slide.title)}</h2>
        <div className="hero-meta">
          <div className="hero-client">
            {slide.client}
            <span>{slide.role}</span>
          </div>
          <div className="hero-client" style={{textAlign: 'right'}}>
            {reelLabel}
            <span style={{opacity: 0.6}}>{String(idx + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
          </div>
        </div>
      </div>

      <div className="hero-progress">
        {slides.map((s, i) => (
          <div key={i + '-' + idx}
            className={"hero-progress-bar " + (active && i === idx ? 'active' : i < idx ? 'done' : '')}>
            <span></span>
          </div>
        ))}
      </div>
    </section>
  );
}

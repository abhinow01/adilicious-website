'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

/**
 * Finale: slides over the reservation section, then (pinned) scrubs:
 *   1. "come say" drifts in, small
 *   2. "hello" rises letter by letter, huge — the loudest word on the page
 *   3. "hello" lifts to the top and a postcard slides up over the section
 * The postcard is a real form that posts to /api/postcard.
 */
export default function SayHello() {
  const root = useRef(null);
  const pin = useRef(null);

  useGSAP(() => {
    const reduce = prefersReducedMotion();
    const mm = gsap.matchMedia();

    mm.add({ isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' }, (ctx) => {
      const { isMobile } = ctx.conditions;
      if (reduce) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      tl.from('.hello-small', { yPercent: 120, opacity: 0, stagger: 0.12, duration: 0.5 })
        .from('.hello-letter', { yPercent: 115, rotate: 6, stagger: 0.07, duration: 0.6, ease: 'power3.out' }, 0.25)
        .from('.hello-word', { scale: 0.88, duration: 1, ease: 'none' }, 0.25)
        .from('.hello-sub', { opacity: 0, y: 24, duration: 0.4 }, 0.9)
        .to({}, { duration: 0.35 })                                             // hold the moment
        // postcard comes in; "hello" makes room but stays the loudest thing on screen
        .to('.hello-sub', { opacity: 0, duration: 0.25 }, 'card')
        .to('.hello-stage', {
          y: () => -window.innerHeight * (isMobile ? 0.33 : 0.36),
          scale: isMobile ? 0.6 : 0.46,
          duration: 1,
          ease: 'power2.inOut',
        }, 'card')
        .fromTo('.postcard-wrap',
          { yPercent: 110, rotate: 7 },
          { yPercent: 0, rotate: -2, duration: 1, ease: 'power3.out' }, 'card+=0.15')
        .fromTo('.postcard-wrap', { rotationX: 25 }, { rotationX: 0, duration: 0.8, ease: 'power2.out' }, 'card+=0.25')
        .from('.pc-stamp', { scale: 1.6, opacity: 0, rotate: 18, duration: 0.3, ease: 'back.out(2)' }, '>-0.15')
        .to({}, { duration: 0.6 });                                              // rest on the finished card
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="hello" className="hello slide-card" ref={root}>
      <div className="hello-pin" ref={pin}>
        <div className="hello-stage">
          <p className="hello-line" aria-hidden="true">
            <span className="hello-mask"><span className="hello-small">come</span></span>
            <span className="hello-mask"><span className="hello-small">say</span></span>
          </p>
          <h2 className="hello-word" aria-label="Come say hello">
            {'hello'.split('').map((ch, i) => (
              <span key={i} className="hello-mask" aria-hidden="true">
                <span className="hello-letter">{ch}</span>
              </span>
            ))}
          </h2>
          <p className="hello-sub">Questions, compliments, a half-baked idea — the kitchen reads every postcard.</p>
        </div>

        <div className="postcard-wrap">
          <Postcard />
        </div>
      </div>
    </section>
  );
}

function Postcard() {
  const card = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [name, setName] = useState('');
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setName(String(data.name || '').split(' ')[0]);
    setStatus('sending');
    try {
      const res = await fetch('/api/postcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      // postmark lands, card is "posted"
      await gsap.timeline()
        .fromTo(card.current.querySelector('.pc-postmark-sent'), { scale: 2.4, opacity: 0, rotate: -24 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.35, ease: 'power4.in' })
        .to(card.current, { y: -12, duration: 0.08, yoyo: true, repeat: 1 })
        .to(card.current, { rotationY: 180, duration: 0.9, ease: 'power3.inOut' }, '+=0.5');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    gsap.to(card.current, { rotationY: 0, duration: 0.8, ease: 'power3.inOut', onComplete: () => setStatus('idle') });
    gsap.set(card.current.querySelector('.pc-postmark-sent'), { opacity: 0 });
    card.current.querySelector('form')?.reset();
  };

  return (
    <div className="postcard" ref={card}>
      {/* FRONT — the writing side */}
      <form className="postcard-face postcard-front" onSubmit={onSubmit}>
        <div className="pc-left">
          <div className="pc-greeting">Dear Adilicious,</div>
          <label className="sr-only" htmlFor="pc-message">Your message</label>
          <textarea id="pc-message" name="message" className="pc-message" required maxLength={1200}
            placeholder="Write your message here…" />
          <div className="pc-sign">
            <span>Yours,</span>
            <label className="sr-only" htmlFor="pc-name">Your name</label>
            <input id="pc-name" name="name" required maxLength={80} placeholder="your name" autoComplete="name" />
          </div>
        </div>

        <div className="pc-divider" aria-hidden="true" />

        <div className="pc-right">
          <div className="pc-top">
            <div className="pc-postmark" aria-hidden="true">
              <span>ADILICIOUS</span><strong>{today}</strong><span>DELHI · 110008</span>
            </div>
            <div className="pc-stamp" aria-hidden="true">
              <img src="/assets/logo-dark.png" alt="" />
              <span>Est. 2026</span>
            </div>
          </div>

          <div className="pc-address">
            <div className="pc-line"><span>To</span><strong>The Kitchen, Adilicious</strong></div>
            <div className="pc-line"><span>Shadipur meets Karampura</span></div>
            <div className="pc-line">
              <label htmlFor="pc-email">Reply to</label>
              <input id="pc-email" type="email" name="email" required maxLength={120} placeholder="you@email.com" autoComplete="email" />
            </div>
            <div className="pc-line">
              <label htmlFor="pc-topic">About</label>
              <select id="pc-topic" name="topic" defaultValue="Just saying hi">
                <option>Just saying hi</option>
                <option>A project idea</option>
                <option>Working with you</option>
                <option>Press</option>
              </select>
            </div>
          </div>

          {/* honeypot for bots */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="pc-hp" aria-hidden="true" />

          <button className="pc-send" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Posting…' : status === 'error' ? 'Didn’t go through — try again' : 'Drop in the postbox →'}
          </button>
        </div>

        <div className="pc-postmark-sent" aria-hidden="true">SENT</div>
      </form>

      {/* BACK — what you see after posting */}
      <div className="postcard-face postcard-back" aria-live="polite">
        {status === 'sent' && (
          <>
            <div className="pc-back-eyebrow">— Received in the kitchen —</div>
            <div className="pc-back-title">Thank you{name ? `, ${name}` : ''}.</div>
            <p className="pc-back-copy">Your postcard is pinned to the pass. A chef will write back within two working days.</p>
            <button className="pc-again" type="button" onClick={reset}>Write another</button>
          </>
        )}
      </div>
    </div>
  );
}

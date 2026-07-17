'use client';
import clsx from 'clsx';
import { useState, useEffect, useRef, useCallback } from 'react';

const MENU = [
  { num: '01', name: 'Appetizers',  label: 'Brand Discovery',    desc: 'Strategy / Research / Positioning' },
  { num: '02', name: 'Mains',       label: 'Concept Films',       desc: 'Big-idea TV & streaming spots' },
  { num: '03', name: 'Sides',       label: 'Social Cutdowns',     desc: 'Vertical, square, tasty bites' },
  { num: '04', name: 'Specials',    label: 'Limited Drops',       desc: 'Stunt campaigns / Collabs' },
  { num: '05', name: 'Desserts',    label: 'Animation & Vfx',     desc: 'CG, mograph, finishing' },
  { num: '06', name: 'Drinks',      label: 'Sound & Music',       desc: 'Original scoring, sonic ID' },
  { num: '07', name: 'Bread Basket',label: 'Always-on Content',   desc: 'Editorial calendars / Series' },
  { num: '08', name: 'House Wine',  label: 'Influencer Pairings', desc: 'Casting, talent, partnerships' },
];

function PlateComponent({ angle = 0, onPrev, onNext }) {
  const step = 360 / MENU.length;

  const active = ((Math.round(-angle / step) % MENU.length) + MENU.length) % MENU.length;
  const current = MENU[active];

  return (
    <div className="plate-stage">
      <div className="plate-marker"></div>

      <div className="plate"></div>
      <div className="plate-ridges"></div>
      <div className="plate-well"></div>
      <div className="plate-sheen"></div>

      <div className="plate-disc"
        style={{ transform: `rotate(${angle}deg)` }}>
        {MENU.map((m, i) => {
          const a = i * step;
          const isActive = i === active;
          return (
            <div key={m.num} className="plate-label"
              style={{ transform: `rotate(${a}deg)` }}>
              <div className={"rim-label " + (isActive ? 'active' : '')}
                style={{ transform: `translate(-50%, 0) rotate(${-angle - a}deg)` }}>
                <span>{m.num}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="plate-center">
        <div className="plate-center-eyebrow">— Course No. {current.num} —</div>
        <div className="plate-center-name">{current.name}</div>
        <div className="plate-center-sub">{current.label}</div>
        <div className="plate-center-desc">{current.desc}</div>
      </div>

      <button className="plate-arrow left" onClick={onPrev} aria-label="Previous course">‹</button>
      <button className="plate-arrow right" onClick={onNext} aria-label="Next course">›</button>
    </div>
  );
}

const POSTERS = [
  { client: 'Solano',  job: 'Hot Sauce',   art: 'linear-gradient(135deg,#d8472d,#f4b13a 60%,#5a1a08)' },
  { client: 'Hexa',    job: 'Mobility',    art: 'linear-gradient(180deg,#2e7e8e,#0a1f2c)' },
  { client: 'Marigold',job: 'Confections', art: 'radial-gradient(circle at 30% 30%,#f1c87a,#6a1b2a 70%)' },
  { client: 'Bayside', job: 'Studios',     art: 'linear-gradient(180deg,#142224,#5e7172)' },
  { client: 'Folio',   job: 'Magazine',    art: 'linear-gradient(135deg,#f0e3b5,#c89a3f 70%,#5a3a08)' },
  { client: 'Pulse',   job: 'Headphones',  art: 'radial-gradient(ellipse at 50% 60%,#1f4d6e,#0e273b 70%)' },
  { client: 'Lichen',  job: 'Outerwear',   art: 'linear-gradient(135deg,#3a4a2a,#7a8a4a 60%,#1a2010)' },
  { client: 'Halocene',job: 'Skincare',    art: 'linear-gradient(135deg,#f4d4c2,#e89878 60%,#a85838)' },
  { client: 'Drift',   job: 'Eyewear',     art: 'radial-gradient(circle at 40% 40%,#e8e4d4,#9a8a6a 80%)' },
  { client: 'Vesper',  job: 'Spirits',     art: 'linear-gradient(180deg,#1a0e08,#4a2818 70%,#a86a3a)' },
  { client: 'Plot',    job: 'Bookshop',    art: 'linear-gradient(135deg,#b8332b,#5a1410 70%)' },
  { client: 'Linus',   job: 'Footwear',    art: 'radial-gradient(ellipse at 50% 30%,#f0e3b5,#7a6a3a 70%)' },
];

function Poster({ p, i }) {
  const rot = ((i * 37) % 7) - 3;
  return (
    <div className="poster" style={{ '--rot': rot + 'deg' }}>
      <div className="poster-art" style={{ background: p.art }}></div>
      <div className="poster-label">
        <span>{p.client}</span>
        <span>№ {String((i % 24) + 1).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function Marquee({ pos, parallaxX }) {
  const items = [...POSTERS, ...POSTERS];
  return (
    <div className={"marquee " + pos} style={{ '--px': (parallaxX || 0) + 'px' }}>
      <div className="marquee-track">
        {items.map((p, i) => <Poster key={pos + i} p={p} i={i} />)}
      </div>
    </div>
  );
}

function Ticker() {
  const items = ['Concept-led', 'Restaurant-trained', 'Story first', 'Made in-house', 'Direction', 'Edit', 'Music', 'VFX', 'Strategy', 'Always hungry'];
  const all = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {all.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function PlateSection() {
  const outerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const max = el.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, max)));
      setProgress(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const N = MENU.length;
  const step = 360 / N;
  const angle = -progress * (N - 1) * step;
  const active = Math.max(0, Math.min(N - 1, Math.round(-angle / step)));

  const goToCourse = (idx) => {
    const el = outerRef.current;
    if (!el) return;
    const max = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + (idx / (N - 1)) * max;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };
  const prev = () => goToCourse(Math.max(0, active - 1));
  const next = () => goToCourse(Math.min(N - 1, active + 1));

  const introOpacity = Math.max(0, 1 - progress * 2.5);
  const introY = -progress * 80;
  const marqueeTopX = -progress * 220;
  const marqueeBotX =  progress * 220;
  const tableScale = 1 + progress * 0.06;
  const plateScale = 0.94 + Math.sin(progress * Math.PI) * 0.08;
  const introRightOpacity = Math.max(0, 1 - progress * 1.5);

  return (
    <section className="plate-outer" ref={outerRef} id="menu">
      <div className="plate-sticky">
        <div className="tablecloth" style={{ transform: `scale(${tableScale})` }}></div>
        <Marquee pos="top" parallaxX={marqueeTopX} />
        <Marquee pos="bottom" parallaxX={marqueeBotX} />

        <div className="plate-intro">
          <div style={{ opacity: introOpacity, transform: `translateY(${introY}px)` }}>
            <div className="plate-intro-eyebrow">— Tonight&apos;s Menu —</div>
            <div className="plate-intro-title">
              Eight courses,<br/>served à la carte.
            </div>
          </div>
          <div className="plate-intro-right" style={{ opacity: introRightOpacity }}>
            Keep scrolling.<br/>
            The plate will spin.
          </div>
        </div>

        <div className="plate-wrap" style={{ transform: `scale(${plateScale})` }}>
          <PlateComponent angle={angle} onPrev={prev} onNext={next} />
        </div>

        <div className="plate-progress">
          {MENU.map((m, i) => (
            <button key={i}
              className={"plate-progress-dot " + (i === active ? 'active' : i < active ? 'done' : '')}
              onClick={() => goToCourse(i)}
              aria-label={`Go to course ${m.num}`}>
              <span>{m.num}</span>
            </button>
          ))}
        </div>

        <div className="plate-instr">
          <svg viewBox="0 0 14 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 2 V26 M2 21 L7 26 L12 21" />
          </svg>
          Scroll to spin
        </div>
      </div>
    </section>
  );
}

function Reservation() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="reserve" className="reservation px-5 md:px-10 lg:px-[56px] py-20 lg:py-[120px] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[80px] items-start">
        <div className='flex flex-col gap-2 lg:gap-4'>
          <div className="reservation-eyebrow">— Book a Table —</div>
          <h2 className="reservation-title">Tell us<br/>what you&apos;re <em>hungry</em><br/>for.</h2>
          <p className="reservation-sub sm:text-[14px] lg:text-[22px] leading-[1.4] w-full flex flex-row flex-wrap">
            We take a limited number of campaigns a year — same way a small
            kitchen handles dinner service. Send the brief. We&apos;ll get back
            within two business days with a tasting menu of ideas.
          </p>
          <div className="reservation-contacts">
            <div>
              <div className="reservation-contacts-label">Kitchen</div>
              <div>hello@adilicious.co</div>
            </div>
            <div>
              <div className="reservation-contacts-label">Press</div>
              <div>press@adilicious.co</div>
            </div>
          </div>
        </div>
        <form className="reservation-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div className="field">
            <label>Your name</label>
            <input type="text" defaultValue="" placeholder="First and last" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@brand.com" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <div className="field">
              <label>Party size (budget)</label>
              <select defaultValue="">
                <option value="" disabled>— Choose —</option>
                <option>Snack · &lt; $25K</option>
                <option>Appetizer · $25–75K</option>
                <option>Main Course · $75–250K</option>
                <option>Tasting Menu · $250K+</option>
              </select>
            </div>
            <div className="field">
              <label>Course</label>
              <select defaultValue="">
                <option value="" disabled>— Choose —</option>
                <option>Concept Film</option>
                <option>Social Cutdowns</option>
                <option>Brand Discovery</option>
                <option>Animation / VFX</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>The brief, in one sentence</label>
            <textarea rows={3} placeholder="We want to launch…"></textarea>
          </div>
          <button className="btn-primary" type="submit">
            {submitted ? 'Order placed — chef will be in touch' : 'Send to the kitchen →'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/assets/logo-cream-new.png" alt="Adilicious" />
            <div className="hidden lg:footer-tag">
              An ad agency that thinks like a restaurant. Brooklyn &amp; Mexico City, est. 2021.
            </div>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>
              <li><a href="#">Appetizers — Strategy</a></li>
              <li><a href="#">Mains — Concept Films</a></li>
              <li><a href="#">Sides — Social</a></li>
              <li><a href="#">Desserts — Animation</a></li>
              <li><a href="#">Drinks — Sound</a></li>
            </ul>
          </div>
          <div>
            <h4>Kitchen</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Reel</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4>Reservations</h4>
            <ul>
              <li><a href="#reserve">Book a tasting</a></li>
              <li><a href="mailto:hello@adilicious.co">hello@adilicious.co</a></li>
              <li><a href="#">+1 (347) 555-0142</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Vimeo</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Adilicious Studio LLC · All courses served fresh</div>
          <div>Made with hunger</div>
        </div>
      </div>
    </footer>
  );
}

export { Ticker, PlateSection, Reservation, Footer };

'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, ScrollSmoother, useGSAP, prefersReducedMotion } from '@/lib/gsap';

export const MENU = [
  { num: '01', name: 'Appetizers',   label: 'Brand Discovery',     desc: 'Strategy / Research / Positioning' },
  { num: '02', name: 'Mains',        label: 'Concept Films',       desc: 'Big-idea TV & streaming spots' },
  { num: '03', name: 'Sides',        label: 'Social Cutdowns',     desc: 'Vertical, square, tasty bites' },
  { num: '04', name: 'Specials',     label: 'Limited Drops',       desc: 'Stunt campaigns / Collabs' },
  { num: '05', name: 'Desserts',     label: 'Animation & VFX',     desc: 'CG, mograph, finishing' },
  { num: '06', name: 'Drinks',       label: 'Sound & Music',       desc: 'Original scoring, sonic ID' },
  { num: '07', name: 'Bread Basket', label: 'Always-on Content',   desc: 'Editorial calendars / Series' },
  { num: '08', name: 'House Wine',   label: 'Influencer Pairings', desc: 'Casting, talent, partnerships' },
];

const POSTERS = [
  { client: 'Solano',   art: 'linear-gradient(135deg,#d8472d,#f4b13a 60%,#5a1a08)' },
  { client: 'Hexa',     art: 'linear-gradient(180deg,#2e7e8e,#0a1f2c)' },
  { client: 'Marigold', art: 'radial-gradient(circle at 30% 30%,#f1c87a,#6a1b2a 70%)' },
  { client: 'Bayside',  art: 'linear-gradient(180deg,#142224,#5e7172)' },
  { client: 'Folio',    art: 'linear-gradient(135deg,#f0e3b5,#c89a3f 70%,#5a3a08)' },
  { client: 'Pulse',    art: 'radial-gradient(ellipse at 50% 60%,#1f4d6e,#0e273b 70%)' },
  { client: 'Lichen',   art: 'linear-gradient(135deg,#3a4a2a,#7a8a4a 60%,#1a2010)' },
  { client: 'Halocene', art: 'linear-gradient(135deg,#f4d4c2,#e89878 60%,#a85838)' },
  { client: 'Drift',    art: 'radial-gradient(circle at 40% 40%,#e8e4d4,#9a8a6a 80%)' },
  { client: 'Vesper',   art: 'linear-gradient(180deg,#1a0e08,#4a2818 70%,#a86a3a)' },
];

const N = MENU.length;
const STEP = 360 / N;
const PX_PER_COURSE = 260;   // wheel distance (px) to move one course
const RELEASE_PX = 160;      // extra scrolling at the first/last course before the page takes over
const SNAP_DELAY = 180;      // ms of no input before the plate settles on the nearest course

export default function PlateSection() {
  const root = useRef(null);
  const stage = useRef(null);
  const rig = useRef(null);
  const disc = useRef(null);
  const cloth = useRef(null);
  const sheen = useRef(null);
  const posters = useRef(null);
  const info = useRef(null);
  const labels = useRef([]);
  const api = useRef({ goTo: () => {} });

  const [active, setActive] = useState(0);
  const [mode, setMode] = useState('idle'); // idle | spinning | end

  // ---------------------------------------------------------------- main plate behaviour
  useGSAP(() => {
    const reduce = prefersReducedMotion();
    const stageEl = stage.current;
    const state = { p: 0 };        // rendered progress, 0 = course 01, 1 = course 08
    let target = 0;                // where the plate is heading
    let overflow = 0;              // scroll distance pushed against the first/last course
    let lastDir = 0;
    let lastActive = -1;
    let locked = false;
    let snapTimer = 0;
    let idleTimer = 0;

    // Rotation of the disc; rim numbers counter-rotate so they always read upright.
    const render = () => {
      const angle = -state.p * (N - 1) * STEP;
      disc.current.style.transform = `rotate(${angle}deg)`;
      labels.current.forEach((el, i) => {
        if (el) el.style.transform = `translate(-50%, 0) rotate(${-angle - i * STEP}deg)`;
      });
      posters.current?.style.setProperty('--spin', state.p.toFixed(4));
      const idx = Math.round(state.p * (N - 1));
      if (idx !== lastActive) { lastActive = idx; setActive(idx); }
    };
    const toP = gsap.quickTo(state, 'p', { duration: reduce ? 0.01 : 0.7, ease: 'power3.out', onUpdate: render });
    render();

    const updateMode = () => setMode(target >= 1 ? 'end' : locked ? 'spinning' : 'idle');

    // Only take over the scroll when the whole stage is on screen (it is shorter than the viewport).
    const inZone = () => {
      const r = stageEl.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.height > vh) return r.top <= 0 && r.bottom >= vh;
      return r.top >= -24 && r.bottom <= vh + 24;
    };

    // Ease the page so the stage is perfectly centred while the plate spins.
    const centerStage = () => {
      const r = stageEl.getBoundingClientRect();
      const off = r.top + r.height / 2 - window.innerHeight / 2;
      if (Math.abs(off) < 6 || r.height > window.innerHeight) return;
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.scrollTo(smoother.scrollTop() + off, true);
      else window.scrollTo({ top: window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
    };

    const scheduleSnap = () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        // Snap in the direction of travel: a single mouse-wheel notch (~120px, less than half a
        // course) must still move to the next course instead of springing back.
        const x = target * (N - 1);
        const snapped = lastDir > 0 ? Math.ceil(x - 0.15) : Math.floor(x + 0.15);
        target = gsap.utils.clamp(0, N - 1, snapped) / (N - 1);
        toP(target);
      }, SNAP_DELAY);
    };

    // Returns true when the plate used the scroll (so the page must not move).
    const consume = (dy) => {
      const dir = Math.sign(dy);
      if (!dir) return false;
      if (dir !== lastDir) { overflow = 0; lastDir = dir; }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { overflow = 0; locked = false; updateMode(); }, 600);

      const atEdge = (dir > 0 && target >= 1) || (dir < 0 && target <= 0);
      if (atEdge) {
        overflow += Math.abs(dy);
        if (overflow > RELEASE_PX) { locked = false; updateMode(); return false; } // let the page move on
        return true;
      }
      overflow = 0;
      if (!locked) { locked = true; centerStage(); }
      target = gsap.utils.clamp(0, 1, target + dy / (PX_PER_COURSE * (N - 1)));
      toP(target);
      scheduleSnap();
      updateMode();
      return true;
    };

    const normalise = (e) => e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);

    const onWheel = (e) => {
      if (e.ctrlKey) return;                       // pinch-zoom on trackpads
      const dy = normalise(e);
      if (Math.abs(e.deltaX) > Math.abs(dy)) return;
      if (!inZone()) { locked = false; return; }
      if (consume(dy)) e.preventDefault();
    };

    let touchY = null;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      const dy = (touchY - y) * 1.8;
      touchY = y;
      if (!inZone()) return;
      if (consume(dy) && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = () => { touchY = null; };

    stageEl.addEventListener('wheel', onWheel, { passive: false });
    stageEl.addEventListener('touchstart', onTouchStart, { passive: true });
    stageEl.addEventListener('touchmove', onTouchMove, { passive: false });
    stageEl.addEventListener('touchend', onTouchEnd);

    // Buttons, dots and arrow keys.
    api.current.goTo = (i) => {
      target = gsap.utils.clamp(0, N - 1, i) / (N - 1);
      toP(target);
      updateMode();
    };

    // ------------------------------------------------ scroll-linked depth (ScrollTrigger scrub)
    // Plate is "set down" on the table as the stage arrives, and tips away as it leaves.
    gsap.set(rig.current, { xPercent: -50, transformOrigin: '50% 50%' });
    gsap.set(cloth.current, { rotationX: 58, transformOrigin: '50% 100%' });
    if (!reduce) {
      gsap.timeline({
        scrollTrigger: { trigger: stageEl, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        defaults: { ease: 'none' },
      })
        .fromTo(rig.current, { rotationX: 48, yPercent: 22, scale: 0.86 }, { rotationX: 24, yPercent: 0, scale: 1, duration: 0.5 })
        .fromTo(cloth.current, { rotationX: 66, backgroundPositionY: '-80px' }, { rotationX: 58, backgroundPositionY: '0px', duration: 0.5 }, 0)
        .fromTo(info.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2 }, 0.3)
        .to(rig.current, { rotationX: 34, yPercent: -6, duration: 0.5 }, 0.5)
        .to(cloth.current, { backgroundPositionY: '80px', duration: 0.5 }, 0.5);

      // Pointer parallax: the plate tilts towards the cursor, the light stays put.
      const tiltY = gsap.quickTo(rig.current, 'rotationY', { duration: 0.8, ease: 'power3' });
      const clothX = gsap.quickTo(cloth.current, 'x', { duration: 1.2, ease: 'power3' });
      const sheenX = gsap.quickTo(sheen.current, 'xPercent', { duration: 1, ease: 'power3' });
      const onMove = (e) => {
        const r = stageEl.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
        tiltY(nx * 10);
        clothX(nx * -30);
        sheenX(nx * -12);
      };
      const onLeave = () => { tiltY(0); clothX(0); sheenX(0); };
      stageEl.addEventListener('pointermove', onMove);
      stageEl.addEventListener('pointerleave', onLeave);
    }

    // Leaving the section resets the "locked" state.
    ScrollTrigger.create({ trigger: stageEl, start: 'top bottom', end: 'bottom top', onToggle: (self) => { if (!self.isActive) { locked = false; updateMode(); } } });

    return () => {
      clearTimeout(snapTimer);
      clearTimeout(idleTimer);
      stageEl.removeEventListener('wheel', onWheel);
      stageEl.removeEventListener('touchstart', onTouchStart);
      stageEl.removeEventListener('touchmove', onTouchMove);
      stageEl.removeEventListener('touchend', onTouchEnd);
    };
  }, { scope: root });

  // ---------------------------------------------------------------- course card swap
  useGSAP(() => {
    gsap.fromTo(info.current.querySelectorAll('[data-reveal]'),
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out', overwrite: true });
  }, { dependencies: [active], scope: root });

  const current = MENU[active];
  const hint =
    mode === 'end' ? 'That’s the full menu — keep scrolling ↓'
    : mode === 'spinning' ? `Course ${active + 1} of ${N}`
    : 'Scroll on the plate to spin it';

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); api.current.goTo(active + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); api.current.goTo(active - 1); }
  };

  return (
    <section className="plate-section" id="menu" ref={root} data-theme="light">
      <div
        className="plate-stage"
        ref={stage}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label="Tonight's menu — use the arrow keys or scroll over the plate to change course"
      >
        {/* table */}
        <div className="plate-cloth" ref={cloth} />

        {/* ad posters on the "wall" behind the plate, nudged by the spin */}
        <div className="plate-posters" ref={posters} aria-hidden="true">
          <div className="plate-posters-track">
            {[...POSTERS, ...POSTERS].map((p, i) => (
              <div key={i} className="poster" style={{ '--rot': (((i * 37) % 7) - 3) + 'deg' }}>
                <div className="poster-art" style={{ background: p.art }} />
                <div className="poster-label"><span>{p.client}</span><span>№ {String((i % POSTERS.length) + 1).padStart(2, '0')}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="plate-vignette" aria-hidden="true" />

        {/* the plate — layered in 3D so it has real thickness and a cast shadow */}
        <div className="plate-rig" ref={rig} aria-hidden="true">
          <div className="plate-cast" />
          <div className="plate-body">
            <div className="plate-ridges" />
            <div className="plate-well" />
            <div className="plate-disc" ref={disc}>
              {MENU.map((m, i) => (
                <div key={m.num} className="plate-label" style={{ transform: `rotate(${i * STEP}deg)` }}>
                  <div ref={(el) => { labels.current[i] = el; }} className={'rim-label' + (i === active ? ' active' : '')}>
                    {m.num}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="plate-sheen" ref={sheen} />
        </div>

        <div className="plate-marker" aria-hidden="true"><span>Tonight&apos;s pick</span></div>

        <header className="plate-intro">
          <div className="plate-intro-eyebrow">— Tonight&apos;s Menu —</div>
          <div className="plate-intro-title">Eight courses,<br />served à la carte.</div>
        </header>

        <div className={'plate-hint ' + mode} aria-live="polite">{hint}</div>

        <div className="plate-info" ref={info}>
          <div className="plate-info-eyebrow" data-reveal>— Course No. {current.num} —</div>
          <h3 className="plate-info-name" data-reveal>{current.name}</h3>
          <div className="plate-info-sub" data-reveal>{current.label}</div>
          <div className="plate-info-desc" data-reveal>{current.desc}</div>
        </div>

        <div className="plate-progress">
          {MENU.map((m, i) => (
            <button key={m.num}
              className={'plate-progress-dot ' + (i === active ? 'active' : i < active ? 'done' : '')}
              onClick={() => api.current.goTo(i)}
              aria-label={`Go to course ${m.num}: ${m.name}`}>
              <span>{m.num}</span>
            </button>
          ))}
        </div>

        <button className="plate-arrow left" onClick={() => api.current.goTo(active - 1)} aria-label="Previous course">‹</button>
        <button className="plate-arrow right" onClick={() => api.current.goTo(active + 1)} aria-label="Next course">›</button>

        <div className="plate-table-edge" aria-hidden="true" />
      </div>
    </section>
  );
}

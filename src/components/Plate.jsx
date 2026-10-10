'use client';
import { useState } from 'react';

// The plate itself now lives in PlateSection.jsx.

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

export { Ticker, Reservation, Footer };

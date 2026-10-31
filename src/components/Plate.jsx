'use client';
import { useState } from 'react';
import { renderDisplayText } from '@/sanity/text';

// The plate itself now lives in PlateSection.jsx. All copy below comes from the CMS as props.

function Ticker({ items = [] }) {
  const all = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {all.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function Reservation({ eyebrow, title, body, form = {}, contacts = [] }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="reserve" className="reservation px-5 md:px-10 lg:px-[56px] py-20 lg:py-[120px] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[80px] items-start">
        <div className='flex flex-col gap-2 lg:gap-4'>
          <div className="reservation-eyebrow">{eyebrow}</div>
          <h2 className="reservation-title">{renderDisplayText(title)}</h2>
          <p className="reservation-sub sm:text-[14px] lg:text-[22px] leading-[1.4] w-full flex flex-row flex-wrap">
            {body}
          </p>
          <div className="reservation-contacts">
            {contacts.map((c) => (
              <div key={c.email || c.label}>
                <div className="reservation-contacts-label">{c.label}</div>
                <div>{c.email}</div>
              </div>
            ))}
          </div>
        </div>
        <form className="reservation-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div className="field">
            <label htmlFor="rs-name">{form.nameLabel}</label>
            <input id="rs-name" type="text" defaultValue="" placeholder={form.namePlaceholder} />
          </div>
          <div className="field">
            <label htmlFor="rs-email">{form.emailLabel}</label>
            <input id="rs-email" type="email" placeholder={form.emailPlaceholder} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <div className="field">
              <label htmlFor="rs-budget">{form.budgetLabel}</label>
              <select id="rs-budget" defaultValue="">
                <option value="" disabled>{form.chooseLabel}</option>
                {(form.budgetOptions ?? []).map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="rs-course">{form.courseLabel}</label>
              <select id="rs-course" defaultValue="">
                <option value="" disabled>{form.chooseLabel}</option>
                {(form.courseOptions ?? []).map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="rs-brief">{form.briefLabel}</label>
            <textarea id="rs-brief" rows={3} placeholder={form.briefPlaceholder}></textarea>
          </div>
          <button className="btn-primary" type="submit">
            {submitted ? form.successLabel : form.submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

/** Footer (currently not rendered on the page; content is ready in Site settings → Footer). */
function Footer({ tagline, columns = [], copyright, signoff, siteName }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/assets/logo-cream-new.png" alt={siteName} />
            <div className="hidden lg:footer-tag">
              {tagline}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {(col.links ?? []).map((l) => (
                  <li key={l.label}><a href={l.href || '#'}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>{copyright}</div>
          <div>{signoff}</div>
        </div>
      </div>
    </footer>
  );
}

export { Ticker, Reservation, Footer };

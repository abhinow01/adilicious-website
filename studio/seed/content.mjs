// The website's content as it was hardcoded before the CMS, copied verbatim.
// `asset('…')` marks a local file that seed.mjs uploads to Sanity.
// Client names and campaigns are placeholders, to be replaced by editors in the Studio.

export const asset = (file, extra = {}) => ({__asset: file, ...extra})

const COURSES = [
  ['appetizers', 'Appetizers', 'Brand Discovery', 'Strategy / Research / Positioning'],
  ['mains', 'Mains', 'Concept Films', 'Big-idea TV & streaming spots'],
  ['sides', 'Sides', 'Social Cutdowns', 'Vertical, square, tasty bites'],
  ['specials', 'Specials', 'Limited Drops', 'Stunt campaigns / Collabs'],
  ['desserts', 'Desserts', 'Animation & VFX', 'CG, mograph, finishing'],
  ['drinks', 'Drinks', 'Sound & Music', 'Original scoring, sonic ID'],
  ['bread-basket', 'Bread Basket', 'Always-on Content', 'Editorial calendars / Series'],
  ['house-wine', 'House Wine', 'Influencer Pairings', 'Casting, talent, partnerships'],
]

const WORK = [
  ['solano', 'Solano', 'linear-gradient(135deg,#d8472d,#f4b13a 60%,#5a1a08)'],
  ['hexa', 'Hexa', 'linear-gradient(180deg,#2e7e8e,#0a1f2c)'],
  ['marigold', 'Marigold', 'radial-gradient(circle at 30% 30%,#f1c87a,#6a1b2a 70%)'],
  ['bayside', 'Bayside', 'linear-gradient(180deg,#142224,#5e7172)'],
  ['folio', 'Folio', 'linear-gradient(135deg,#f0e3b5,#c89a3f 70%,#5a3a08)'],
  ['pulse', 'Pulse', 'radial-gradient(ellipse at 50% 60%,#1f4d6e,#0e273b 70%)'],
  ['lichen', 'Lichen', 'linear-gradient(135deg,#3a4a2a,#7a8a4a 60%,#1a2010)'],
  ['halocene', 'Halocene', 'linear-gradient(135deg,#f4d4c2,#e89878 60%,#a85838)'],
  ['drift', 'Drift', 'radial-gradient(circle at 40% 40%,#e8e4d4,#9a8a6a 80%)'],
  ['vesper', 'Vesper', 'linear-gradient(180deg,#1a0e08,#4a2818 70%,#a86a3a)'],
]

const ref = (_id, _key) => ({_type: 'reference', _ref: _id, _key})

export const courses = COURSES.map(([id, name, label, description]) => ({
  _id: `course-${id}`,
  _type: 'course',
  name,
  label,
  description,
  slug: {_type: 'slug', current: id},
}))

export const works = WORK.map(([id, client, posterArt]) => ({
  _id: `work-${id}`,
  _type: 'work',
  client,
  posterArt,
}))

export const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Adilicious',
  tagline: 'An ad agency that thinks like a restaurant',
  contacts: [
    {_key: 'kitchen', _type: 'contact', label: 'Kitchen', email: 'hello@adilicious.co'},
    {_key: 'press', _type: 'contact', label: 'Press', email: 'press@adilicious.co'},
  ],
  seo: {
    _type: 'seo',
    title: 'Adilicious — An ad agency that thinks like a restaurant',
    description:
      'Adilicious is an ad agency that thinks like a restaurant: brand strategy, concept films, social content, animation and sound, cooked to order in Delhi.',
    image: asset('share-default.jpg', {alt: 'Adilicious — an ad agency that thinks like a restaurant'}),
    noIndex: false,
  },
  organization: {
    legalName: 'Adilicious Studio LLC',
    logo: asset('org-logo.png', {alt: 'Adilicious logo'}),
    email: 'hello@adilicious.co',
    locality: 'New Delhi',
    postalCode: '110008',
    country: 'IN',
    sameAs: [],
  },
  // Not rendered yet (the footer is commented out on the page). Copied from the old footer;
  // the placeholder phone number and "#" links still need real values.
  footer: {
    tagline: 'An ad agency that thinks like a restaurant. Brooklyn & Mexico City, est. 2021.',
    columns: [
      {
        _key: 'menu',
        _type: 'footerColumn',
        heading: 'Menu',
        links: [
          ['Appetizers — Strategy', '#menu'],
          ['Mains — Concept Films', '#menu'],
          ['Sides — Social', '#menu'],
          ['Desserts — Animation', '#menu'],
          ['Drinks — Sound', '#menu'],
        ].map(([label, href], i) => ({_key: `m${i}`, _type: 'link', label, href})),
      },
      {
        _key: 'kitchen',
        _type: 'footerColumn',
        heading: 'Kitchen',
        links: ['About', 'Press', 'Reel', 'Careers'].map((label, i) => ({_key: `k${i}`, _type: 'link', label, href: '#'})),
      },
      {
        _key: 'reservations',
        _type: 'footerColumn',
        heading: 'Reservations',
        links: [
          ['Book a tasting', '#reserve'],
          ['hello@adilicious.co', 'mailto:hello@adilicious.co'],
          ['+1 (347) 555-0142', '#'],
          ['Instagram', '#'],
          ['Vimeo', '#'],
        ].map(([label, href], i) => ({_key: `r${i}`, _type: 'link', label, href})),
      },
    ],
    copyright: '© 2026 Adilicious Studio LLC · All courses served fresh',
    signoff: 'Made with hunger',
  },
}

export const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    reelLabel: 'Reel · 2024–26',
    slides: [
      {
        _key: 'spot-01',
        _type: 'heroSlide',
        video: asset('hero-appetizers.mp4'),
        poster: asset('hero-appetizers-poster.jpg'),
        tag: '— Now Serving · Spot 01 —',
        title: 'The Crave\n*Manifesto*',
        client: 'For Solano Hot Sauce',
        role: 'Concept, Direction & Edit',
      },
      {
        _key: 'spot-03',
        _type: 'heroSlide',
        video: asset('hero-dessert.mp4'),
        poster: asset('hero-dessert-poster.jpg'),
        tag: '— Now Serving · Spot 03 —',
        title: 'Sweet on\n*Strangers*',
        client: 'For Marigold Confections',
        role: 'Brand Anthem',
      },
      {
        _key: 'spot-04',
        _type: 'heroSlide',
        video: asset('hero-dessert.mp4'),
        poster: asset('hero-dessert-poster.jpg'),
        tag: '— Now Serving · Spot 04 —',
        title: 'Lights, Or\n*Whatever*',
        client: 'For Bayside Studios',
        role: 'Series Identity',
      },
    ],
  },
  ticker: ['Concept-led', 'Restaurant-trained', 'Story first', 'Made in-house', 'Direction', 'Edit', 'Music', 'VFX', 'Strategy', 'Always hungry'],
  manifesto: {
    eyebrow: '— House rules —',
    text:
      "We're a kitchen, not a factory. Every idea is cooked to order — slow where it matters, fast where it counts. No reheated trends. No microwaved content. Just honest work, served hot.",
    signature: '— The Chefs, Adilicious',
  },
  menu: {
    eyebrow: "— Tonight's Menu —",
    title: 'Eight courses,\nserved à la carte.',
    markerLabel: "Tonight's pick",
    courses: courses.map((c) => ref(c._id, c._id)),
    posters: works.map((w) => ref(w._id, w._id)),
  },
  reservation: {
    eyebrow: '— Book a Table —',
    title: "Tell us\nwhat you're *hungry*\nfor.",
    body:
      "We take a limited number of campaigns a year — same way a small kitchen handles dinner service. Send the brief. We'll get back within two business days with a tasting menu of ideas.",
    form: {
      nameLabel: 'Your name',
      namePlaceholder: 'First and last',
      emailLabel: 'Email',
      emailPlaceholder: 'you@brand.com',
      chooseLabel: '— Choose —',
      budgetLabel: 'Party size (budget)',
      budgetOptions: ['Snack · < $25K', 'Appetizer · $25–75K', 'Main Course · $75–250K', 'Tasting Menu · $250K+'],
      courseLabel: 'Course',
      courseOptions: ['Concept Film', 'Social Cutdowns', 'Brand Discovery', 'Animation / VFX', 'Other'],
      briefLabel: 'The brief, in one sentence',
      briefPlaceholder: 'We want to launch…',
      submitLabel: 'Send to the kitchen →',
      successLabel: 'Order placed — chef will be in touch',
    },
  },
  hello: {
    smallWords: 'come say',
    bigWord: 'hello',
    subline: 'Questions, compliments, a half-baked idea — the kitchen reads every postcard.',
    postcard: {
      greeting: 'Dear Adilicious,',
      messagePlaceholder: 'Write your message here…',
      signOff: 'Yours,',
      namePlaceholder: 'your name',
      postmarkTop: 'ADILICIOUS',
      postmarkBottom: 'DELHI · 110008',
      stampText: 'Est. 2026',
      toLabel: 'To',
      toName: 'The Kitchen, Adilicious',
      addressLine: 'Shadipur meets Karampura',
      replyToLabel: 'Reply to',
      emailPlaceholder: 'you@email.com',
      topicLabel: 'About',
      topics: ['Just saying hi', 'A project idea', 'Working with you', 'Press'],
      sendLabel: 'Drop in the postbox →',
      sendingLabel: 'Posting…',
      errorLabel: 'Didn’t go through — try again',
    },
    thanks: {
      eyebrow: '— Received in the kitchen —',
      title: 'Thank you',
      text: 'Your postcard is pinned to the pass. A chef will write back within two working days.',
      againLabel: 'Write another',
    },
  },
}

export const allDocuments = [siteSettings, homePage, ...courses, ...works]

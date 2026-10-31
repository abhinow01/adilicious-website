# How the scroll animations work

Everything uses GSAP (already a dependency) + `@gsap/react`. All plugins are registered once in
`src/lib/gsap.js` — always import from there.

## The page, top to bottom

| Section | File | Technique |
|---|---|---|
| Smooth scroll for the whole page | `SmoothScroll.jsx` | **ScrollSmoother** wraps the content. Fixed things (nav, loader) live outside it. |
| Hero → shrinks, next card slides over it | `StackOver.jsx` | ScrollTrigger `pin: true, pinSpacing: false` + scrubbed `scale` / dim overlay |
| Manifesto words light up | `Manifesto.jsx` | **SplitText** (words) + pinned, scrubbed `stagger` on opacity |
| Half-plate that spins | `PlateSection.jsx` | Wheel/touch capture on the stage, `gsap.quickTo` for the rotation, ScrollTrigger scrub for the 3D tilt |
| Reservation → hello card slides over it | `StackOver.jsx` again | same as hero |
| "come say **hello**" → postcard | `SayHello.jsx` | One pinned timeline, scrubbed: masked letters rise, hello lifts, postcard lands |

## The four patterns worth learning

**1. Scrub = scroll is the playhead.**
`scrollTrigger: { start, end, scrub: true }` maps scroll distance onto a timeline's progress. Build
the timeline as if it were a 3-second video, and the user's scroll plays it. `scrub: 0.8` adds
0.8s of catch-up smoothing.

**2. Pin = freeze a section while its timeline plays.**
`pin: true` holds the element in place; `end: '+=300%'` means "for 3 screen-heights of
scrolling". GSAP adds padding after it so the page doesn't jump (that's `pinSpacing`).

**3. Slide-over = pin WITHOUT spacing.**
`pinSpacing: false` holds a section but adds no extra scroll, so the next section (which has a
higher `z-index` — the `.slide-card` class) scrolls up over it. Reuse it anywhere:

```jsx
<StackOver><SomeSection /></StackOver>
<section className="slide-card">…the card that covers it…</section>
```

**4. Masked reveals.** Wrap each word/letter in an `overflow: hidden` span and animate the inner
span from `yPercent: 110` to `0` — the text appears to rise out of a slot. See `.hello-mask`.

## Plate behaviour (PlateSection.jsx)

- The stage is ~76% of the viewport tall, so the sections above and below stay visible.
- Wheel/touch **over the stage** spins the plate (`preventDefault` stops the page). Anywhere else
  scrolls the page normally.
- At the first/last course the plate needs ~160px of extra scrolling (`RELEASE_PX`) before the
  page takes over, so a fast flick doesn't fly past the menu.
- It snaps to a course in the direction you were scrolling (`SNAP_DELAY`), so one mouse-wheel
  notch = one course.
- Tunables at the top of the file: `PX_PER_COURSE`, `RELEASE_PX`, `SNAP_DELAY`.
- Keyboard: focus the plate and use the arrow keys. The arrows/dots still work.

## Rules that will save you hours

- No `position: sticky` inside ScrollSmoother — use `pin`.
- Any component that creates ScrollTriggers must wait for the smoother: `const ready = useSmootherReady()`
  (from `SmoothScroll.jsx`), then `if (!ready) return;` inside `useGSAP` with `dependencies: [ready]`.
  The smoother starts when the intro loader finishes (`<SmoothScroll enabled={introDone}>`), while the
  page content itself is already in the server HTML for search engines.
- Copy comes from the CMS as props. Never hardcode text in components (see CMS.md).
- No `scroll-behavior: smooth` in CSS — it fights ScrollTrigger (removed from `globals.css`).
- Create animations inside `useGSAP(() => { … }, { scope: ref })` — it cleans them up on unmount.
- After anything changes layout (images, fonts, accordions), call `ScrollTrigger.refresh()`.
- Add `markers: true` to any `scrollTrigger` while building — it draws the start/end lines.
- Avoid `filter: blur()` and animated masks on big elements; they repaint every frame (this took
  the plate from 60fps to 7fps before it was removed).
- Everything respects `prefers-reduced-motion` (no smoothing, no scrubbed transforms).

## Postcard form

Posts JSON to `src/app/api/postcard/route.js`, which validates and currently only logs the
message. Hook up email delivery there (e.g. Resend, Nodemailer or a Slack webhook).

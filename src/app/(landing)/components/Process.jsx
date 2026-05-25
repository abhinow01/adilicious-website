'use client';

import { useEffect, useState } from 'react';

export default function Process() {
const steps = [
  {
    title: 'Appetizer',
    description:
      'Discovery, brand immersion, audience research, and understanding what your audience actually craves.',
    video: '/videos/appetizers.mp4',
  },
  {
    title: 'Main Course',
    description:
      'Creative strategy, production, storytelling, and campaign execution served at full strength.',
    video: '/videos/main-course.mp4',
  },
  {
    title: 'Dessert',
    description:
      'Optimization, performance refinement, reporting, and scaling what leaves the strongest aftertaste.',
    video: '/videos/dessert.mp4',
  },
];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('process-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (section.offsetHeight - viewportHeight)));
      const stepIndex = Math.min(steps.length - 1, Math.floor(scrollProgress * steps.length));
      setActiveStep(stepIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="process-section" className="relative h-[300vh] bg-stone-100">
      <div className="absolute inset-0 z-0">
  {steps.map((step, index) => (
    <video
      key={step.title}
      src={step.video}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`
        absolute inset-0 h-full w-full object-cover
        transition-opacity duration-700 ease-in-out
        ${activeStep === index ? 'opacity-100' : 'opacity-0'}
      `}
    />
  ))}
</div>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(120,113,108,0.05) 0px, rgba(120,113,108,0.05) 2px, transparent 2px, transparent 20px)',
          }}
        
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_40%)]" />

        <div className="relative z-30 flex h-full items-center justify-center px-6">
          <div className="relative h-[720px] w-full max-w-5xl">
            <div className="absolute bottom-20 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-black/10 blur-3xl" />

            <div className="absolute bottom-0 left-1/2 h-[640px] w-[900px] -translate-x-1/2 rounded-t-[999px] bg-gradient-to-t from-stone-100 via-stone-50 to-white shadow-[0_-20px_80px_rgba(0,0,0,0.18)]" />

            <div className="absolute bottom-8 left-1/2 h-[580px] w-[820px] -translate-x-1/2 rounded-t-[999px] border border-white/80 bg-gradient-to-b from-white via-stone-50 to-stone-100 shadow-[inset_0_20px_30px_rgba(255,255,255,0.95),inset_0_-18px_28px_rgba(0,0,0,0.08)]" />

            <div className="absolute bottom-20 left-1/2 h-[480px] w-[700px] -translate-x-1/2 rounded-t-[999px] bg-gradient-to-b from-white/90 to-stone-100/90 shadow-[inset_0_8px_20px_rgba(255,255,255,0.9)]" />

            <div className="absolute bottom-0 h-48 w-full bg-gradient-to-t from-stone-100 via-stone-100/95 to-transparent" />

            <div className="absolute inset-0 z-20 flex items-center justify-center px-8 text-center">
              <div
                key={activeStep}
                className="max-w-2xl animate-in fade-in duration-500"
              >
                <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">
                  Our Process
                </span>
                <h2 className="mb-6 text-5xl font-light tracking-tight text-stone-900 md:text-6xl">
                  {steps[activeStep].title}
                </h2>
                <p className="mx-auto max-w-xl text-lg leading-8 text-stone-600">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

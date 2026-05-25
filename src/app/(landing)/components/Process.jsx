'use client';

import { useEffect, useState } from 'react';
import Plate3D from './Plate3d';
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

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('process-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          -rect.top / (section.offsetHeight - viewportHeight)
        )
      );

      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(scrollProgress * steps.length)
      );

      setActiveStep((prev) =>
        prev !== stepIndex ? stepIndex : prev
      );
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    handleScroll();

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="process-section"
      className="relative h-[300vh]"
    >
      {/* VIDEO BACKGROUND */}
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
              ${
                activeStep === index
                  ? 'opacity-100'
                  : 'opacity-0'
              }
            `}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-black/10" />

      <div className="sticky top-0 h-screen">
        <div className="relative flex h-full w-full items-center justify-center overflow-visible px-[4vw]">

          {/* PLATE SHADOW */}
          <div
            className="
              absolute
              bottom-[10%]
              left-1/2
              z-20
              h-[20vw]
              w-[20vw]
              min-h-[140px]
              min-w-[140px]
              -translate-x-1/2
              rounded-full
              bg-black/20
              blur-3xl
            "
          />

          {/* 3D PLATE */}
          <div
            className="
              absolute
              bottom-0
              left-1/2
              z-30
              w-[90%]
              h-[80%]
              -translate-x-1/2
              overflow-visible
            "
          >
            <Plate3D />
          </div>

          {/* TEXT */}
          <div
            className="
              absolute
              inset-0
              z-40
              flex
              items-center
              justify-center
              px-[6vw]
              text-center
            "
          >
            <div
              key={activeStep}
              className="
                w-full
                max-w-[60%]
                animate-in
                fade-in
                duration-500
              "
            >
              <span
                className="
                  mb-4
                  block
                  text-[0.75rem]
                  font-semibold
                  uppercase
                  tracking-[0.45em]
                  text-black/70
                "
              >
                Our Process
              </span>

              <h2
                className="
                  mb-6
                  text-[clamp(2rem,5vw,5rem)]
                  font-light
                  tracking-tight
                  text-black
                "
              >
                {steps[activeStep].title}
              </h2>

              <p
                className="
                  mx-auto
                  text-[clamp(1rem,1.6vw,1.3rem)]
                  leading-[1.7]
                  text-black/75
                "
              >
                {steps[activeStep].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
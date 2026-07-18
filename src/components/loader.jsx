'use client';
import { useEffect, useState ,useRef } from "react";
import { motion, useAnimation } from "motion/react";

export default function HangingSignLoader({
  logoSrc = "/logo-cream-new.png",
  companyName = "RESTAURANT",
  onFinished
}) {
  const controls = useAnimation();
  const overlayControls = useAnimation();
  // Initialize to "intro" immediately so initial renders match
  const [phase, setPhase] = useState("intro"); 
  const hasRun = useRef(false);
  // String sway keyframes per phase
  const leftStringD = {
    intro: ["M10,0 Q10,100 10,200", "M10,0 Q28,90 10,200", "M10,0 Q-8,110 10,200", "M10,0 Q20,96 10,200", "M10,0 Q-2,104 10,200", "M10,0 Q10,100 10,200"],
    flip: ["M10,0 Q10,100 10,200", "M10,0 Q-30,84 10,200", "M10,0 Q24,112 10,200", "M10,0 Q-10,96 10,200", "M10,0 Q10,100 10,200"],
    settle: ["M10,0 Q10,100 10,200", "M10,0 Q18,96 10,200", "M10,0 Q-4,104 10,200", "M10,0 Q10,100 10,200"],
    exit: ["M10,0 Q10,100 10,200"]
  };

  const rightStringD = {
    intro: ["M10,0 Q10,100 10,200", "M10,0 Q-28,90 10,200", "M10,0 Q8,110 10,200", "M10,0 Q-20,96 10,200", "M10,0 Q2,104 10,200", "M10,0 Q10,100 10,200"],
    flip: ["M10,0 Q10,100 10,200", "M10,0 Q30,84 10,200", "M10,0 Q-24,112 10,200", "M10,0 Q10,96 10,200", "M10,0 Q10,100 10,200"],
    settle: ["M10,0 Q10,100 10,200", "M10,0 Q-18,96 10,200", "M10,0 Q4,104 10,200", "M10,0 Q10,100 10,200"],
    exit: ["M10,0 Q10,100 10,200"]
  };

  const durations = { intro: 2.2, flip: 1.8, settle: 1.2, exit: .5 };

  useEffect(() => {
    if (hasRun.current) return; // skip StrictMode's phantom first invocation
    hasRun.current = true;
    async function run() {
      // 1. Intro Sway
      await controls.start({
        rotateZ: [12, -10, 7, -5, 3, -2, 0],
        transition: { duration: 2.2, ease: "easeOut" }
      });

      // 2. Flip Sign
      setPhase("flip");
      await controls.start({
        rotateY: [0, 210, 170, 185, 180],
        rotateZ: [0, 8, -5, 2, 0],
        transition: { duration: 1.8, ease: "easeInOut" }
      });

      // 3. Settle Down
      // setPhase("settle");
      // await controls.start({
      //   rotateZ: [2, -2, 1, -1, 0],
      //   transition: { duration: 1.2, ease: "easeInOut" }
      // });

      // 4. Exit Slide Upward
      setPhase("exit");
      await overlayControls.start({
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Smooth cubic-bezier exit
      });
      onFinished?.();
    }
    run();
  }, [controls, overlayControls , onFinished]);

  return (
    <motion.div
      initial={{ y: "0%" }}
      animate={overlayControls}
      className="fixed inset-0 z-[9999] bg-[#163a55] overflow-hidden w-screen h-screen"
    >
      {/* Left String */}
      <div
        className="absolute"
        style={{ left: "calc(50% - 120px)", top: 0, width: 20, height: "calc(50% - 60px)" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 20 200"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <motion.path
            initial={{ d: leftStringD.intro[0] }} // Hardcoded initial string line prevents mount delay gap
            stroke="#d1d5db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            animate={{ d: leftStringD[phase] }}
            transition={{
              duration: durations[phase],
              ease: "easeInOut",
              repeat: phase === "settle" || phase === "intro" ? Infinity : 0,
              repeatType: "mirror"
            }}
          />
        </svg>
      </div>

      {/* Right String */}
      <div
        className="absolute"
        style={{ left: "calc(50% + 100px)", top: 0, width: 20, height: "calc(50% - 80px)" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 20 200"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <motion.path
            initial={{ d: rightStringD.intro[0] }} // Hardcoded initial string line prevents mount delay gap
            stroke="#d1d5db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            animate={{ d: rightStringD[phase] }}
            transition={{
              duration: durations[phase],
              ease: "easeInOut",
              repeat: phase === "settle" || phase === "intro" ? Infinity : 0,
              repeatType: "mirror"
            }}
          />
        </svg>
      </div>

      {/* Rivets */}
      <div
        className="absolute h-3 w-3 rounded-full bg-zinc-300"
        style={{ left: "calc(50% - 116px)", top: "calc(50% - 60px)" }}
      />
      <div
        className="absolute h-3 w-3 rounded-full bg-zinc-300"
        style={{ left: "calc(50% + 104px)", top: "calc(50% - 60px)" }}
      />

      {/* Board */}
      <motion.div
        animate={controls}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "top center",
          position: "absolute",
          left: "50%",
          top: "calc(50% - 80px)",
          x: "-50%"
        }}
        className="relative h-40 w-80"
      >
        <motion.div
          animate={{
            x: [0, 6, -5, 3, -2, 0],
            opacity: [.18, .25, .2, .18]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
          className="absolute left-6 top-[150px] h-8 w-72 rounded-full bg-black blur-xl"
        />
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform .8s"
          }}
        >
          <div
            className="open-text absolute inset-0 flex flex-col items-center justify-center border-[8px] border-[#1f4d6e] bg-[#e2d291]"
            style={{
              backfaceVisibility: "hidden",
              boxShadow: "0 15px 40px rgba(0,0,0,.45)",
              borderRadius: "10%",
            }}
          >
            OPEN
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center border-[8px] border-[#1f4d6e] bg-[#e2d291]"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              boxShadow: "0 15px 40px rgba(0,0,0,.45)",
              borderRadius: "10%"
            }}
          >
            <img
              src={logoSrc}
              alt={companyName}
              className="h-[70%] w-[70%] object-contain"
            />
          </div>
          <div className="absolute left-0 top-0 h-full w-2 rounded-l "/>
          <div className="absolute right-0 top-0 h-full w-2 rounded-r "/>
          <div className="absolute left-0 top-0 h-2 w-full rounded-t "/>
          <div className="absolute bottom-0 left-0 h-2 w-full rounded-b "/>
        </div>
      </motion.div>
    </motion.div>
  );
}
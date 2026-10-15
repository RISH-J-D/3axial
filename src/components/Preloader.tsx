import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [animStage, setAnimStage] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: Green Cartesian Axes spawn/draw first (0ms)
    setAnimStage(1);

    // Stage 2: Orange 'A' graph draws into the axes (700ms)
    const timer1 = setTimeout(() => {
      setAnimStage(2);
    }, 450);

    // Stage 3: Blue '3' (left) and 'xial' + subtitle (right) roll out from 'A' graph (1700ms)
    const timer2 = setTimeout(() => {
      setAnimStage(3);
    }, 1050);

    // Stage 4: Tagline Fades Up (2600ms)
    const timer3 = setTimeout(() => {
      setAnimStage(4);
    }, 1450);

    // Complete & Dismiss Preloader (4300ms)
    const timer4 = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      >
        {/* Crisp Architectural Grid Background */}

        {/* Pure HTML / SVG Vector Logo Precision Animation Stage */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full text-center">

          {/* Pure HTML / SVG Logo Stage */}
          <div className="relative w-[380px] sm:w-[450px] h-[190px] sm:h-[210px] flex items-center justify-center mb-4">

            <svg viewBox="0 0 450 190" className="w-full h-full overflow-visible select-none">

              {/* STAGE 1: Green Cartesian Axes (#2E8540) Spawn First */}
              <g id="cartesian-axes">
                {/* Horizontal Axis Line (y=116) */}
                <motion.line
                  x1="15"
                  y1="116"
                  x2="435"
                  y2="116"
                  stroke="#2E8540"
                  strokeWidth="4"
                  strokeLinecap="square"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
                {/* Vertical Axis Line (x=136) */}
                <motion.line
                  x1="136"
                  y1="8"
                  x2="136"
                  y2="185"
                  stroke="#2E8540"
                  strokeWidth="4"
                  strokeLinecap="square"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </g>

              {/* STAGE 2: Orange 'A' Roof Bracket Graph Drawn IN the Axes */}
              {animStage >= 2 && (
                <g id="orange-a-graph">
                  <motion.path
                    d="M 80 114 C 102 74 118 32 134 18 C 142 10 148 18 160 38 L 246 148 C 238 148 216 132 192 102 C 168 72 150 48 136 68 C 124 82 100 106 80 114 Z"
                    fill="#E66A00"
                    stroke="#E66A00"
                    strokeWidth="2"
                    initial={{ pathLength: 0, fillOpacity: 0, opacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </g>
              )}

              {/* STAGE 3: Blue '3' (left) and Blue 'xial' + Subtitle (right) Roll Out from 'A' */}
              {animStage >= 3 && (
                <g id="rollout-elements">

                  {/* Blue '3' sitting right on top of green line (y=116) */}
                  <motion.text
                    x="15"
                    y="112"
                    fill="#1A73E8"
                    fontSize="80"
                    fontWeight="700"
                    fontFamily="'Inter Tight', 'Inter', system-ui, sans-serif"
                    letterSpacing="-2"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    3
                  </motion.text>

                  {/* Blue 'xial' sitting right on top of green line (y=116) */}
                  <motion.text
                    x="214"
                    y="112"
                    fill="#1A73E8"
                    fontSize="80"
                    fontWeight="700"
                    fontFamily="'Inter Tight', 'Inter', system-ui, sans-serif"
                    letterSpacing="-1"
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    xial
                  </motion.text>

                  {/* Black Subtitle ('Steel Detailing Services Pvt. Ltd.') sitting cleanly BELOW green axis line (y=146) */}
                  <motion.text
                    x="148"
                    y="170"
                    fill="#1F2937"
                    fontSize="19"
                    fontWeight="500"
                    fontFamily="'Inter', system-ui, sans-serif"
                    letterSpacing="0.2"
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Steel Detailing Services Pvt. Ltd.
                  </motion.text>

                </g>
              )}

            </svg>

          </div>

          {/* STAGE 4: Official Tagline Fading Up */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={animStage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-2 space-y-1"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
              Expertise · Dedication · Quality · Progression
            </p>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

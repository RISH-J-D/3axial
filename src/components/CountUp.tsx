import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  // A figure such as "800+", "24/7" or "AISC · CISC". Only a leading integer is animated.
  value: string;
  duration?: number;
  className?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Counts a figure up from zero the first time it scrolls into view.
export const CountUp: React.FC<CountUpProps> = ({ value, duration = 1400, className }) => {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(() => (target === null || reducedMotion() ? value : `0${suffix}`));

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null || reducedMotion()) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setShown(`${Math.round(target * easeOut(p))}${suffix}`);
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, suffix, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {shown}
    </span>
  );
};

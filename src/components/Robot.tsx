import { useEffect, useId, useRef } from 'react';
import { motion, useMotionValue, useSpring, type MotionValue } from 'framer-motion';

type Props = {
  className?: string;
  /** Eyes follow the pointer when true. */
  track?: boolean;
  /** Explicit gaze, -1..1 on each axis. Overrides tracking. */
  look?: { x: MotionValue<number> | number; y: MotionValue<number> | number };
};

/** The Ask Developers robot — a friendly head with a visor and glowing eyes. */
export function Robot({ className = 'h-40 w-40', track = false, look }: Props) {
  const gid = useId();
  const ref = useRef<SVGSVGElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 16 });
  const y = useSpring(rawY, { stiffness: 120, damping: 16 });

  useEffect(() => {
    if (!track || look) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      rawX.set(Math.max(-1, Math.min(1, dx * 2.4)) * 5);
      rawY.set(Math.max(-1, Math.min(1, dy * 2.4)) * 4);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [track, look, rawX, rawY]);

  // Explicit gaze: numbers set once, motion values subscribe.
  useEffect(() => {
    if (!look) return;
    const subs: (() => void)[] = [];
    const bind = (src: MotionValue<number> | number, dst: MotionValue<number>, scale: number) => {
      if (typeof src === 'number') dst.set(src * scale);
      else {
        dst.set(src.get() * scale);
        subs.push(src.on('change', (v) => dst.set(v * scale)));
      }
    };
    bind(look.x, rawX, 5);
    bind(look.y, rawY, 4);
    return () => subs.forEach((u) => u());
  }, [look, rawX, rawY]);

  const eye = `url(#${gid}-eye)`;
  return (
    <svg ref={ref} viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}-head`} x1="20" y1="26" x2="100" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id={`${gid}-eye`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffc247" />
          <stop offset="1" stopColor="#ff7a45" />
        </linearGradient>
        <radialGradient id={`${gid}-glow`}>
          <stop stopColor="#ff7a45" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff7a45" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Antenna */}
      <line x1="60" y1="14" x2="60" y2="26" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="10" r="10" fill={`url(#${gid}-glow)`} className="animate-pulse-soft [transform-origin:60px_10px]" />
      <circle cx="60" cy="10" r="4" fill="#ff7a45" />

      {/* Ears */}
      <rect x="4" y="54" width="10" height="22" rx="5" fill="#333333" />
      <rect x="106" y="54" width="10" height="22" rx="5" fill="#333333" />

      {/* Head */}
      <rect x="14" y="26" width="92" height="80" rx="26" fill={`url(#${gid}-head)`} />
      <rect x="14.5" y="26.5" width="91" height="79" rx="25.5" stroke="white" strokeOpacity="0.22" />

      {/* Visor */}
      <rect x="24" y="40" width="72" height="48" rx="18" fill="#0a0a0a" />
      <rect x="24.5" y="40.5" width="71" height="47" rx="17.5" stroke="white" strokeOpacity="0.08" />
      <path d="M32 46h56" stroke="white" strokeOpacity="0.06" strokeWidth="6" strokeLinecap="round" />

      {/* Eyes */}
      <motion.g style={{ x, y }}>
        <motion.g
          animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
          transition={{ duration: 4.8, times: [0, 0.9, 0.94, 0.98, 1], repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '60px 64px' }}
        >
          <rect x="39" y="55" width="13" height="18" rx="6" fill={eye} />
          <rect x="68" y="55" width="13" height="18" rx="6" fill={eye} />
          <rect x="42" y="58" width="4" height="5" rx="2" fill="white" fillOpacity="0.85" />
          <rect x="71" y="58" width="4" height="5" rx="2" fill="white" fillOpacity="0.85" />
        </motion.g>
      </motion.g>

      {/* Smile */}
      <path d="M50 80c3 3 7 4 10 4s7-1 10-4" stroke="#ff7a45" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

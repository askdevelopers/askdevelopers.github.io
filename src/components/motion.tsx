import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView } from 'framer-motion';

/** Apple-style ease-out — fast start, long settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise + sharpen once the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Splits text into words that slide up one after another. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.1,
  gradientFrom,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Index of the first word that gets the gradient treatment. */
  gradientFrom?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${gradientFrom !== undefined && i >= gradientFrom ? 'text-gradient' : ''}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

/** Counts up from 0 to the number inside `value` ("10+", "100%") when it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  // Memoised so the effect below doesn't re-run (and restart from 0) on every render.
  const match = useMemo(() => value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/), [value]);
  const target = match ? Number(match[2]) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setN(target),
    });
    return () => controls.stop();
  }, [inView, target, match]);

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {match[1]}
      {n}
      {match[3]}
    </span>
  );
}

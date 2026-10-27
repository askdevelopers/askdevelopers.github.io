import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { Robot } from './Robot';
import { PAGE_SECTIONS } from '@/lib/data';
import { scrollToId } from '@/lib/smooth-scroll';

type Stop = (typeof PAGE_SECTIONS)[number] & { at: number };

/** A vertical rail on the right edge. The robot rides it as the page scrolls and looks the way you're going. */
export function ScrollBot() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.5 });
  const top = useTransform(progress, [0, 1], ['0%', '100%']);
  const velocity = useVelocity(scrollY);
  const lookY = useTransform(velocity, [-2000, 0, 2000], [-1, 0, 1]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setStops(
        PAGE_SECTIONS.map((s) => {
          const el = document.getElementById(s.id);
          return { ...s, at: el ? Math.min(1, el.offsetTop / max) : 0 };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let idx = 0;
    stops.forEach((s, i) => {
      if (v >= s.at - 0.015) idx = i;
    });
    setActive(idx);
  });

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-[52vh] w-12 -translate-y-1/2 lg:block" aria-hidden="true">
      <div className="absolute inset-y-0 right-[17px] w-px bg-[#9a948a]/40" />
      {stops.map((s, i) => (
        <button
          key={s.id}
          type="button"
          title={s.label}
          onClick={() => scrollToId(s.id)}
          className={`pointer-events-auto absolute right-[13px] h-[9px] w-[9px] -translate-y-1/2 rounded-full transition-colors duration-300 ${
            i <= active ? 'bg-brand-500' : 'bg-[#9a948a]/60 hover:bg-[#9a948a]'
          }`}
          style={{ top: `${s.at * 100}%` }}
        />
      ))}
      <motion.div style={{ top }} className="absolute right-0 -translate-y-1/2">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-[11px] font-medium tracking-wide text-[#9a948a]">{stops[active]?.label}</span>
          <div className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]">
            <Robot className="h-10 w-10" look={{ x: 0, y: lookY }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

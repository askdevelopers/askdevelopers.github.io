import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './motion';
import { PROCESS_STEPS } from '@/lib/data';

const N = PROCESS_STEPS.length;

/** A timeline whose line draws itself as you scroll; each step lights up as the line reaches it. */
export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 55%'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N)))));

  return (
    <section id="process" className="theme-dark py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            align="left"
            size="md"
            eyebrow="How we work"
            title={
              <>
                From idea
                <br />
                to launch.
              </>
            }
          >
            Six clear steps that keep every project on track, transparent and on time — with weekly demos so you always
            know where things stand.
          </SectionHeader>
          <Reveal delay={0.15} className="mt-10 hidden items-baseline gap-3 lg:flex">
            <span className="font-display text-7xl font-semibold tracking-[-0.04em] text-fg tabular-nums">
              {String(active + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-sm text-muted">/ {String(N).padStart(2, '0')}</span>
          </Reveal>
        </div>

        <ol ref={ref} className="relative">
          <div className="absolute bottom-8 left-[15px] top-8 w-px bg-line/10" aria-hidden="true" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-8 left-[15px] top-8 w-px origin-top bg-gradient-to-b from-brand-500 via-amber-500 to-amber-300"
            aria-hidden="true"
          />
          {PROCESS_STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i <= active;
            return (
              <li key={step.title} className="relative pb-6 pl-12 last:pb-0">
                <motion.span
                  animate={{
                    scale: done ? 1 : 0.7,
                    backgroundColor: done ? '#ff5a1f' : '#2a2a2a',
                    boxShadow: done ? '0 0 0 6px rgba(255,90,31,0.25)' : '0 0 0 0 rgba(255,90,31,0)',
                  }}
                  transition={{ duration: 0.45 }}
                  className="absolute left-[9px] top-8 h-[13px] w-[13px] rounded-full border-2 border-ink-900"
                  aria-hidden="true"
                />
                <Reveal>
                  <div className={`rounded-[24px] border p-6 transition-colors duration-500 sm:p-7 ${done ? 'border-line/10 bg-card' : 'border-transparent bg-card/40'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted">STEP {String(i + 1).padStart(2, '0')}</span>
                      <Icon className={`h-5 w-5 transition-colors duration-500 ${done ? 'text-brand-300' : 'text-muted'}`} />
                    </div>
                    <h3 className={`mt-5 font-display text-2xl font-semibold tracking-tight transition-colors duration-500 ${done ? 'text-fg' : 'text-muted'}`}>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { AIVisual, CrmVisual, MobileVisual, WebVisual } from './PlatformVisuals';
import { PLATFORM_STEPS } from '@/lib/data';

const N = PLATFORM_STEPS.length;
const VISUALS = [AIVisual, WebVisual, MobileVisual, CrmVisual];

/** Opacity / drift for step `i` as the pinned scroll progress moves through its slice of 0..1. */
function useStage(progress: MotionValue<number>, i: number) {
  const seg = 1 / N;
  const start = i * seg;
  const end = start + seg;
  const f = seg * 0.3;
  const first = i === 0;
  const last = i === N - 1;
  const input = first ? [end - f, end] : last ? [start, start + f] : [start, start + f, end - f, end];
  const opacity = useTransform(progress, input, first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, input, first ? [0, -36] : last ? [36, 0] : [36, 0, 0, -36]);
  return { opacity, y };
}

function StepText({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const step = PLATFORM_STEPS[i];
  const { opacity, y } = useStage(progress, i);
  return (
    // All steps share one grid cell, so the block is as tall as the longest step and nothing overflows.
    <motion.div style={{ opacity, y }} className="col-start-1 row-start-1 flex flex-col justify-center text-center will-change-transform lg:text-left">
      <p className="eyebrow text-brand-300">{step.eyebrow}</p>
      <h3 className="headline mt-2 text-3xl leading-[1.04] sm:text-5xl lg:mt-3 lg:text-6xl">{step.title}</h3>
      <p className="lede mx-auto mt-3 max-w-md text-[15px] sm:text-lg lg:mx-0 lg:mt-4">{step.description}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
        {step.chips.map((c) => (
          <li key={c} className="chip">
            {c}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Stage({ i, progress, children }: { i: number; progress: MotionValue<number>; children: ReactNode }) {
  const { opacity, y } = useStage(progress, i);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  );
}

/** Pinned for four screens: the copy and the product mock-up morph as you scroll. */
export function Platform() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N)))));

  return (
    <section id="platform" className="theme-dark">
      <div ref={ref} className="relative" style={{ height: `${(N + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="container-x">
            <p className="mb-3 text-center text-sm font-medium text-muted lg:mb-10">One partner. Every platform.</p>

            <div className="grid items-center gap-4 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
              <div className="order-2 grid lg:order-1">
                {PLATFORM_STEPS.map((s, i) => (
                  <StepText key={s.key} i={i} progress={scrollYProgress} />
                ))}
              </div>

              {/* On phones the stage is sized by height so the whole story fits one screen. */}
              <div className="relative order-1 aspect-square h-[min(360px,38svh)] justify-self-center lg:order-2 lg:aspect-[5/4] lg:h-auto lg:w-full lg:max-w-[640px] lg:justify-self-stretch">
                {VISUALS.map((Visual, i) => (
                  <Stage key={PLATFORM_STEPS[i].key} i={i} progress={scrollYProgress}>
                    <Visual active={active === i} />
                  </Stage>
                ))}
              </div>
            </div>

            <ol className="mx-auto mt-4 flex max-w-xs gap-2 lg:mt-12" aria-label="Platform steps">
              {PLATFORM_STEPS.map((s, i) => (
                <li
                  key={s.key}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-fg' : 'bg-fg/15'}`}
                  aria-current={i === active ? 'step' : undefined}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

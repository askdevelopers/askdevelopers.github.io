import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Apple, ArrowRight, Check, ChevronRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { NeuralSphere } from './NeuralSphere';
import { Robot } from './Robot';
import { CountUp, EASE, Reveal, SplitWords } from './motion';
import { STATS } from '@/lib/data';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Text drifts up and fades first; the stage shrinks and follows.
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const stageOpacity = useTransform(scrollYProgress, [0.1, 0.75], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const cardA = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const cardB = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const cardC = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const cardD = useTransform(scrollYProgress, [0, 1], [0, -130]);

  return (
    <section id="home" ref={ref} className="theme-dark relative isolate overflow-hidden pt-32 sm:pt-40">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[90vh] bg-[radial-gradient(55%_45%_at_50%_0%,rgba(255,90,31,0.14),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container-x">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="mx-auto max-w-4xl text-center">
          <motion.p {...fade(0)} className="eyebrow">
            Web · Mobile · AI — engineered end to end
          </motion.p>
          <h1 className="headline mt-5 text-[3.4rem] leading-[0.95] sm:text-7xl lg:whitespace-nowrap lg:text-[5.6vw] 2xl:text-[5.5rem]">
            <SplitWords text="Imagine. Build. Launch." gradientFrom={1} delay={0.1} />
          </h1>
          <motion.p {...fade(0.5)} className="mx-auto mt-7 max-w-2xl text-xl font-medium text-fg sm:text-2xl">
            We build technology that moves businesses forward.
          </motion.p>
          <motion.p {...fade(0.6)} className="lede mx-auto mt-3 max-w-2xl text-base sm:text-lg">
            AI platforms, web products, iOS, Android &amp; Flutter apps and business CRMs — one senior team, from the
            first idea to the shipped product.
          </motion.p>
          <motion.div {...fade(0.72)} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
            <a href="#contact" className="btn-primary group">
              Start your project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#work" className="link-arrow">
              See our work
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Stage */}
        <motion.div
          style={{ scale: stageScale, opacity: stageOpacity, y: stageY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
          className="relative mx-auto mt-10 aspect-[4/3] w-full max-w-[780px] will-change-transform sm:mt-14 sm:aspect-[16/10]"
        >
          <NeuralSphere className="absolute inset-0 h-full w-full" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-float drop-shadow-[0_30px_60px_rgba(255,122,69,0.3)]">
              <Robot track className="h-28 w-28 sm:h-52 sm:w-52" />
            </div>
          </div>

          {/* Floating cards — each drifts at its own speed on scroll. */}
          <motion.div style={{ y: cardA }} className="glass absolute left-0 top-[2%] w-44 rounded-2xl p-4 sm:left-[4%] sm:top-[12%] sm:w-56">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-fg">Hi! 👋</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-blink rounded-full bg-brand-400" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </span>
            </div>
            <p className="mt-1 text-sm leading-snug text-muted">What are we building today?</p>
          </motion.div>

          <motion.div style={{ y: cardB }} className="glass absolute bottom-[16%] right-[2%] hidden w-52 rounded-2xl p-4 sm:block">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Apple className="h-4 w-4 text-fg" />
              App Store · Play Store
            </div>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">12+</p>
            <p className="text-xs text-muted">Apps shipped &amp; live</p>
          </motion.div>

          <motion.div style={{ y: cardC }} className="glass absolute bottom-[6%] left-[8%] hidden items-center gap-2 rounded-full px-3.5 py-2 sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-xs font-medium text-fg/90">RAG · Agents · Automation</span>
          </motion.div>

          <motion.div style={{ y: cardD }} className="glass absolute right-[6%] top-[8%] hidden w-44 rounded-2xl p-4 sm:block">
            <div className="flex items-center justify-between text-xs text-muted">
              Custom CRM
              <LayoutDashboard className="h-3.5 w-3.5 text-brand-400" />
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {['Lead pipeline', 'Roles & permissions', 'Reports'].map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-fg/90">
                  <Check className="h-3 w-3 text-brand-400" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-y-10 border-t border-line/10 pb-20 pt-12 sm:mt-14 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="px-2 text-center">
              <p className="font-display text-5xl font-semibold tracking-[-0.03em] text-fg sm:text-6xl">
                <CountUp value={s.value} />
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

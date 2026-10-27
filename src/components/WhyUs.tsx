import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EASE, Reveal } from './motion';
import { PROCESS_STEPS, WHY_CHOOSE } from '@/lib/data';

export function WhyUs() {
  return (
    <section id="why" className="theme-light py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="theme-dark relative isolate overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#7a2a0c_0%,#3a1a0c_45%,#141414_100%)] px-6 pb-8 pt-16 sm:px-12 sm:pt-20">
            <div
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
              aria-hidden="true"
            />

            <p className="eyebrow text-center text-brand-200">Why choose us</p>
            <h2 className="headline mx-auto mt-5 max-w-3xl text-center text-4xl font-medium leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Where <span className="font-semibold">clarity</span> meets
              <br />
              <span className="font-semibold">creativity.</span>
            </h2>

            {/* Two points reaching for each other — human insight meets machine precision */}
            <div className="relative mx-auto mt-10 h-24 max-w-xl" aria-hidden="true">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                className="absolute left-0 right-1/2 top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-transparent to-white/70"
              />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                className="absolute left-1/2 right-0 top-1/2 h-px origin-right -translate-y-1/2 bg-gradient-to-l from-transparent to-brand-300"
              />
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/30 blur-xl" />
              <motion.span
                initial={{ x: -60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                className="absolute left-[calc(50%-14px)] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.6)]"
              />
              <motion.span
                initial={{ x: 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                className="absolute left-[calc(50%+4px)] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand-300 shadow-[0_0_16px_4px_rgba(255,122,69,0.8)]"
              />
              <span className="absolute left-0 top-[calc(50%+14px)] font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                Human insight
              </span>
              <span className="absolute right-0 top-[calc(50%+14px)] font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                Engineering
              </span>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WHY_CHOOSE.map((w, i) => {
                const Icon = w.icon;
                return (
                  <motion.li
                    key={w.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                    transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.1]"
                  >
                    <Icon className="h-5 w-5 text-brand-200" />
                    <p className="mt-4 font-display text-base font-semibold tracking-tight text-white">{w.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{w.description}</p>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Home-page strip: the top reasons to work with us beside the six-step process, both opening /process/. */
export function WhyPreview() {
  return (
    <section id="why" className="theme-light py-16 sm:py-24">
      <div className="container-x">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="theme-dark rounded-[28px] bg-[linear-gradient(160deg,#7a2a0c_0%,#3a1a0c_50%,#141414_100%)] p-6 sm:p-8">
            <p className="eyebrow text-brand-200">Why choose us</p>
            <h2 className="headline mt-2 text-3xl text-white sm:text-4xl">Where clarity meets creativity.</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {WHY_CHOOSE.slice(0, 4).map((w) => {
                const Icon = w.icon;
                return (
                  <li key={w.title} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-200" />
                    <span>
                      <span className="block text-sm font-semibold text-white">{w.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-white/70">{w.description}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col rounded-[28px] bg-card p-6 shadow-tile sm:p-8">
            <p className="eyebrow">How we work</p>
            <h2 className="headline mt-2 text-3xl sm:text-4xl">From idea to launch.</h2>
            <ol className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {PROCESS_STEPS.map((p, i) => (
                <li key={p.title} className="flex items-baseline gap-2 text-sm text-fg">
                  <span className="font-mono text-xs text-link">{String(i + 1).padStart(2, '0')}</span>
                  {p.title}
                </li>
              ))}
            </ol>
            <a href="/process/" className="group mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-6 text-[15px] font-medium text-link">
              See our process
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

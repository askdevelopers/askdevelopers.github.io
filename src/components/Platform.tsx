import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AIVisual, CrmVisual, MobileVisual, WebVisual } from './PlatformVisuals';
import { EASE } from './motion';
import { PLATFORM_STEPS } from '@/lib/data';

const N = PLATFORM_STEPS.length;
const VISUALS = [AIVisual, WebVisual, MobileVisual, CrmVisual];

/** "What we build": pick a platform on the left, its pitch and product mock-up open on the right. */
export function Platform() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = PLATFORM_STEPS[active];
  const Visual = VISUALS[active];

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + N) % N;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="platform" className="theme-dark py-16 sm:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">What we build</p>
            <h2 className="headline mt-2 text-3xl sm:text-5xl">One partner. Every platform.</h2>
          </div>
          <p className="max-w-sm text-[15px] text-muted">Pick one to see what we deliver.</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[300px_1fr]">
          <div
            role="tablist"
            aria-label="Platforms"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {PLATFORM_STEPS.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.key}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`platform-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="platform-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 flex-col rounded-2xl px-4 py-3 text-left transition-colors duration-300 lg:py-4 ${
                    selected ? 'bg-brand-gradient text-white' : 'bg-card text-fg hover:bg-ink-700'
                  }`}
                >
                  <span className={`text-[11px] uppercase tracking-[0.14em] ${selected ? 'text-white/80' : 'text-muted'}`}>{s.eyebrow}</span>
                  <span className="mt-0.5 whitespace-nowrap text-sm font-semibold">{s.title}</span>
                </button>
              );
            })}
          </div>

          <div id="platform-panel" role="tabpanel" aria-labelledby={`platform-tab-${active}`} className="overflow-hidden rounded-[28px] bg-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[1fr_1.1fr]"
              >
                <div>
                  <h3 className="headline text-2xl leading-[1.08] sm:text-4xl">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {step.chips.map((c) => (
                      <li key={c} className="chip">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <a href={step.href} className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium text-link">
                    {step.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
                <div className="relative mx-auto aspect-square w-full sm:aspect-[5/4] max-w-[460px]">
                  <Visual active />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

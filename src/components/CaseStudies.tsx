import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { EASE, Reveal } from './motion';
import { CASE_STUDIES } from '@/lib/data';

export function CaseStudies() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = CASE_STUDIES[active];

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + CASE_STUDIES.length) % CASE_STUDIES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="case-studies" className="theme-light py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Case studies"
          title={
            <>
              The problem,
              <br />
              and how we solved it.
            </>
          }
        >
          A closer look at the challenge, the approach and the result behind a few of the products we&apos;ve shipped.
        </SectionHeader>

        <Reveal className="mt-14 grid gap-4 lg:grid-cols-[300px_1fr]">
          <div
            role="tablist"
            aria-label="Case studies"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {CASE_STUDIES.map((cs, i) => {
              const selected = i === active;
              return (
                <button
                  key={cs.project}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`cs-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="cs-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all duration-300 lg:py-4 ${
                    selected ? 'bg-ink-800 text-white shadow-tile-hover' : 'bg-card text-fg shadow-tile hover:-translate-y-0.5'
                  }`}
                >
                  <span className={`font-mono text-xs ${selected ? 'text-brand-300' : 'text-muted'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block whitespace-nowrap text-sm font-semibold">{cs.project}</span>
                    <span className={`hidden text-xs lg:block ${selected ? 'text-white/60' : 'text-muted'}`}>{cs.industry}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id="cs-panel" role="tabpanel" aria-labelledby={`cs-tab-${active}`} className="min-h-[560px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={c.project}
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden rounded-[28px] bg-card shadow-tile"
              >
                <div
                  className="relative isolate flex flex-col gap-4 overflow-hidden p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8"
                  style={{
                    background: `radial-gradient(70% 120% at 90% 0%, hsla(${c.hue}, 90%, 60%, 0.55), transparent 60%), radial-gradient(50% 90% at 0% 100%, hsla(${(c.hue + 50) % 360}, 85%, 55%, 0.3), transparent 70%), #0c0c0c`,
                  }}
                >
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden="true" />
                  <div>
                    <span className="inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs backdrop-blur">{c.industry}</span>
                    <h3 className="headline mt-3 text-3xl text-white sm:text-4xl">{c.project}</h3>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-slate-100 sm:self-auto"
                  >
                    {c.linkLabel}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>

                <div className="grid border-b border-line/10 md:grid-cols-2 md:divide-x md:divide-line/10">
                  <div className="p-6 sm:p-8">
                    <p className="eyebrow">Challenge</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{c.challenge}</p>
                  </div>
                  <div className="border-t border-line/10 p-6 sm:p-8 md:border-t-0">
                    <p className="eyebrow">Solution</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{c.solution}</p>
                  </div>
                </div>

                <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr]">
                  <div>
                    <p className="eyebrow">Key features</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {c.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-fg/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-link" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow">Stack</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {c.stack.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="eyebrow mt-6">Outcome</p>
                    <p className="mt-3 text-[15px] font-medium leading-relaxed text-fg">{c.outcome}</p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

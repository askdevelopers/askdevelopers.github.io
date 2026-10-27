import type { PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Apple, ArrowUpRight, Check } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { EASE, Reveal } from './motion';
import { APPS, WEB_PROJECTS } from '@/lib/data';

/** Tilts toward the pointer, springs back on leave. */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 22 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 7);
    ry.set(px * 9);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Work() {
  return (
    <section id="work" className="theme-dark relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Selected work"
          title={
            <>
              Built for real
              <br />
              businesses.
            </>
          }
        >
          CRMs, e-commerce stores and content platforms that run companies every day — plus native and cross-platform
          apps live on the App Store.
        </SectionHeader>

        {/* Web platforms */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {WEB_PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.1}>
              <TiltCard>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-[28px] bg-card transition-shadow duration-300 hover:shadow-card"
                >
                  <div className="relative m-2 overflow-hidden rounded-[22px] border border-white/10 bg-ink-950">
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      ))}
                      <span className="ml-2 truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/40">
                        {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </span>
                    </div>
                    <div
                      className="relative flex h-44 items-end overflow-hidden p-6 sm:h-56"
                      style={{
                        background: `radial-gradient(80% 90% at 85% 10%, hsla(${p.hue}, 90%, 60%, 0.5), transparent 60%), radial-gradient(60% 70% at 10% 100%, hsla(${(p.hue + 50) % 360}, 85%, 55%, 0.32), transparent 70%), #0c0c0c`,
                      }}
                    >
                      <div className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-70" />
                      <div className="relative">
                        <span className="chip border-white/20 bg-black/30 text-white backdrop-blur">{p.badge}</span>
                        <p className="headline mt-3 text-3xl text-white transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                          {p.title}
                        </p>
                      </div>
                      <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3">
                    <p className="text-[15px] leading-relaxed text-fg/90">{p.description}</p>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Mobile apps */}
        <div className="mt-24 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">On the App Store</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h3 className="headline mt-3 text-3xl sm:text-5xl">Ten apps, shipped and live.</h3>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[15px] text-muted">
              Native and cross-platform apps across travel, health, commerce, music and lifestyle.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {APPS.map((a, i) => (
            <motion.a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 5) * 0.06 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group flex flex-col rounded-[22px] bg-card p-4"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-[16px] font-display text-xl font-bold text-white shadow-card"
                style={{ background: `linear-gradient(135deg, hsl(${a.hue}, 85%, 60%), hsl(${(a.hue + 40) % 360}, 80%, 45%))` }}
              >
                {a.name.charAt(0)}
              </span>
              <p className="mt-4 font-display text-base font-semibold tracking-tight text-fg">{a.name}</p>
              <p className="text-xs text-muted">{a.tag}</p>
              {a.description && <p className="mt-2 text-xs leading-snug text-muted">{a.description}</p>}
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-link">
                <Apple className="h-3.5 w-3.5" />
                App Store
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

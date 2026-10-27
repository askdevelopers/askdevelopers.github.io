import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { EASE } from './motion';
import { SERVICES, type Service } from '@/lib/data';

/* On the light section: default = white tile, light = black tile, featured = brand gradient. */
const TONES: Record<NonNullable<Service['tone']>, { card: string; muted: string; icon: string; chip: string; cta: string }> = {
  default: {
    card: 'bg-card text-fg shadow-tile',
    muted: 'text-muted',
    icon: 'bg-fg/5 text-fg',
    chip: 'border-line/10 bg-fg/5 text-fg/70',
    cta: 'text-link',
  },
  light: {
    card: 'bg-ink-800 text-white',
    muted: 'text-white/60',
    icon: 'bg-white/10 text-white',
    chip: 'border-white/10 bg-white/10 text-white/80',
    cta: 'text-brand-400',
  },
  featured: {
    card: 'bg-brand-gradient text-white shadow-glow-accent',
    muted: 'text-white/80',
    icon: 'bg-white/15 text-white',
    chip: 'border-white/25 bg-white/15 text-white',
    cta: 'text-white',
  },
};

export function Services() {
  return (
    <section id="services" className="theme-light py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Services"
          title={
            <>
              Everything you need
              <br />
              to ship.
            </>
          }
        >
          One senior team for the full lifecycle of your product — strategy, design, engineering, launch and everything
          after.
        </SectionHeader>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const tone = s.tone ?? 'default';
            const t = TONES[tone];
            const Icon = s.icon;
            const featured = tone === 'featured';
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col overflow-hidden rounded-[28px] p-7 transition-shadow duration-300 hover:shadow-tile-hover ${t.card} ${
                  featured ? 'lg:col-span-2' : ''
                }`}
              >
                {featured && (
                  <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
                )}
                <div className="flex items-start justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.icon}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`font-mono text-xs ${t.muted}`}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className={`mt-8 font-display font-semibold tracking-tight ${featured ? 'max-w-md text-3xl sm:text-4xl' : 'text-2xl'}`}>
                  {s.title}
                </h3>
                <p className={`mt-3 text-[15px] leading-relaxed ${t.muted} ${featured ? 'max-w-lg' : ''}`}>{s.description}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {s.points.map((p) => (
                    <li key={p} className={`rounded-full border px-2.5 py-1 text-[11px] ${t.chip}`}>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-4 pt-7">
                  <p className={`font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] ${t.muted}`}>{s.stack.join(' · ')}</p>
                  <a href="#contact" className={`inline-flex min-h-[44px] shrink-0 items-center gap-1 text-[15px] font-medium ${t.cta}`}>
                    Discuss
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

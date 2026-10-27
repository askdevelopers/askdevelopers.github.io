import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { SERVICES, type Service } from '@/lib/data';
import { useReveal } from '@/lib/hooks';

const TONES: Record<NonNullable<Service['tone']>, { card: string; muted: string; icon: string; chip: string; cta: string }> = {
  default: {
    card: 'glass text-white hover:border-white/20 hover:bg-white/[0.06]',
    muted: 'text-slate-400',
    icon: 'border-white/10 bg-white/5 text-brand-300',
    chip: 'border-white/10 bg-white/5 text-slate-300',
    cta: 'bg-white/10 text-white hover:bg-white/15',
  },
  light: {
    card: 'border border-transparent bg-slate-100 text-ink-900',
    muted: 'text-slate-600',
    icon: 'border-ink-900/10 bg-white text-brand-600',
    chip: 'border-ink-900/10 bg-white text-slate-700',
    cta: 'bg-ink-900 text-white hover:bg-ink-700',
  },
  featured: {
    card: 'border border-transparent bg-brand-gradient text-white shadow-glow-violet',
    muted: 'text-white/80',
    icon: 'border-white/25 bg-white/15 text-white',
    chip: 'border-white/25 bg-white/15 text-white',
    cta: 'bg-white text-ink-900 hover:bg-slate-100',
  },
};

export function Services() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="services" ref={ref} className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="Our services"
          title={
            <>
              From idea to
              <br />
              operating product.
            </>
          }
        >
          One senior team for the full lifecycle of your product — strategy, design, engineering, launch and
          everything after.
        </SectionHeader>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const t = TONES[s.tone ?? 'default'];
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className={`reveal group flex flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 ${t.card}`}
                style={{ transitionDelay: `${(i % 4) * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className={`font-mono text-xs ${t.muted}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${t.icon}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold leading-tight tracking-tight">{s.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${t.muted}`}>{s.description}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {s.points.map((p) => (
                    <li key={p} className={`rounded-full border px-2.5 py-1 text-[11px] ${t.chip}`}>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <a
                    href="#contact"
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${t.cta}`}
                  >
                    Discuss
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

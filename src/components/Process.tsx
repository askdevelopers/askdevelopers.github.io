import { SectionHeader } from './SectionHeader';
import { PROCESS_STEPS } from '@/lib/data';
import { useReveal } from '@/lib/hooks';

export function Process() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="process" ref={ref} className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="How we work"
          title={
            <>
              A proven path from
              <br />
              idea to launch.
            </>
          }
        >
          Six clear steps that keep every project on track, transparent, and on time — with weekly demos so you always
          know where things stand.
        </SectionHeader>

        <ol className="mt-14 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="reveal relative" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                {/* Connector rail */}
                <div className="flex items-center">
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/40" style={{ animationDelay: `${i * 0.4}s` }} />
                    <span className="h-3 w-3 rounded-full border-2 border-brand-400 bg-ink-900" />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-brand-400/60 via-white/10 to-transparent" />
                </div>
                <div className="glass mt-5 h-[calc(100%-2.25rem)] rounded-3xl p-6 transition-colors hover:border-white/20">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-slate-500">STEP {String(i + 1).padStart(2, '0')}</span>
                    <Icon className="h-5 w-5 text-brand-300" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

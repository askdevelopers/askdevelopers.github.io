import { WHY_CHOOSE } from '@/lib/data';
import { useReveal } from '@/lib/hooks';

export function WhyUs() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="why" ref={ref} className="py-10 sm:py-16">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#1a2f8f_0%,#0e1a52_45%,#070912_100%)] px-6 pb-10 pt-16 sm:px-12 sm:pt-20">
          <div
            className="absolute inset-0 -z-10 bg-grid-faint [background-size:44px_44px] [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
            aria-hidden="true"
          />

          <p className="reveal text-center eyebrow text-brand-200">Why choose us</p>
          <h2 className="reveal heading mx-auto mt-5 max-w-3xl text-center text-4xl font-medium leading-[1.05] sm:text-6xl">
            Where <span className="font-bold">clarity</span> meets
            <br />
            <span className="font-bold">creativity.</span>
          </h2>

          {/* Two points reaching for each other — human insight meets machine precision */}
          <div className="reveal relative mx-auto mt-10 h-24 max-w-xl" aria-hidden="true">
            <span className="absolute left-0 right-1/2 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent to-white/70" />
            <span className="absolute left-1/2 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-l from-transparent to-brand-300" />
            <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/30 blur-xl" />
            <span className="absolute left-[calc(50%-14px)] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.6)]" />
            <span className="absolute left-[calc(50%+4px)] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand-300 shadow-[0_0_16px_4px_rgba(109,141,255,0.8)]" />
            <span className="absolute left-0 top-[calc(50%+14px)] font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Human insight
            </span>
            <span className="absolute right-0 top-[calc(50%+14px)] font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Engineering
            </span>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_CHOOSE.map((w, i) => {
              const Icon = w.icon;
              return (
                <li
                  key={w.title}
                  className="reveal rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <Icon className="h-5 w-5 text-brand-200" />
                  <p className="mt-4 font-display text-base font-semibold tracking-tight text-white">{w.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300/80">{w.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

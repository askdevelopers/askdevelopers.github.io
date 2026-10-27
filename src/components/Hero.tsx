import { Apple, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { NeuralSphere } from './NeuralSphere';
import { STATS } from '@/lib/data';

const ANNOTATIONS = [
  { label: 'Design', left: '22%', height: 'h-14' },
  { label: 'Build', left: '50%', height: 'h-20' },
  { label: 'Launch', left: '78%', height: 'h-12' },
];

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 sm:pt-32">
      {/* Backdrop: glow + faint grid */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_30%,rgba(61,99,255,0.22),transparent_70%),radial-gradient(40%_40%_at_15%_60%,rgba(139,92,246,0.16),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-grid-faint [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          {/* Copy */}
          <div className="relative z-10">
            <p className="eyebrow animate-fade-up leading-relaxed">
              Web. Mobile. AI.
              <br />
              Engineered end to end.
            </p>

            <h1 className="heading mt-6 animate-fade-up text-[3.4rem] leading-[0.95] [animation-delay:80ms] sm:text-7xl lg:text-[5.6rem]">
              Imagine.
              <br />
              <span className="text-gradient">Build.</span>
              <br />
              <span className="text-gradient">Launch.</span>
            </h1>

            <p className="mt-7 max-w-lg animate-fade-up text-lg font-medium text-white [animation-delay:160ms] sm:text-xl">
              Your trusted technology partner for web, mobile &amp; AI solutions.
            </p>
            <p className="mt-3 max-w-lg animate-fade-up text-base leading-relaxed text-slate-400 [animation-delay:200ms]">
              From mobile apps to enterprise CRMs and AI agents — we build scalable, secure, and beautifully designed
              digital products.
            </p>

            <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:260ms] sm:flex-row sm:items-center sm:gap-6">
              <a href="#contact" className="btn-primary group">
                Start your project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-1.5 self-center border-b sm:self-auto border-white/30 pb-0.5 text-sm font-medium text-slate-200 transition-colors hover:border-white hover:text-white"
              >
                See our work
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px] animate-fade-up [animation-delay:200ms]">
            {ANNOTATIONS.map((a) => (
              <div
                key={a.label}
                className="pointer-events-none absolute top-0 hidden -translate-x-1/2 flex-col items-center sm:flex"
                style={{ left: a.left }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{a.label}</span>
                <span className={`mt-2 w-px bg-gradient-to-b from-white/50 to-transparent ${a.height}`} />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            ))}

            <NeuralSphere className="absolute inset-0 h-full w-full" />

            {/* Floating glass cards */}
            <div className="glass absolute left-0 top-[18%] w-56 animate-float rounded-2xl p-4 shadow-card sm:-left-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Hi! 👋</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-blink rounded-full bg-brand-400"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-1 text-sm leading-snug text-slate-300">What are we building today?</p>
            </div>

            <div className="glass absolute bottom-[14%] right-0 w-52 animate-float rounded-2xl p-4 shadow-card [animation-delay:-2.5s] sm:-right-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Apple className="h-4 w-4 text-white" />
                App Store
              </div>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">10+</p>
              <p className="text-xs text-slate-400">Apps shipped &amp; live</p>
            </div>

            <div className="glass absolute bottom-[6%] left-[8%] hidden animate-float items-center gap-2 rounded-full px-3.5 py-2 shadow-card [animation-delay:-4s] sm:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-xs font-medium text-slate-200">RAG · Agents · Automation</span>
            </div>
          </div>
        </div>

        {/* Bento stats */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="glass group relative animate-fade-up overflow-hidden rounded-2xl p-5 sm:p-6"
              style={{ animationDelay: `${320 + i * 60}ms` }}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">0{i + 1}</p>
              <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4 border-b border-white/10 pb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-[11px]">
          <span>01 / 06</span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden sm:inline">Scalable</span>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline">Secure</span>
          <span className="hidden sm:inline">/</span>
          <span>On-time</span>
        </div>
      </div>
    </section>
  );
}

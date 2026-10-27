import { ArrowUpRight, Apple, Check } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { APPS, WEB_PROJECTS } from '@/lib/data';
import { useReveal } from '@/lib/hooks';

export function Work() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="work" ref={ref} className="relative py-20 sm:py-28">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(139,92,246,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container-x">
        <SectionHeader
          eyebrow="Selected work"
          title={
            <>
              Built by operators,
              <br />
              <span className="text-slate-500">not spectators.</span>
            </>
          }
        >
          CRMs, e-commerce stores and content platforms that run real businesses — plus native and cross-platform apps
          live on the App Store.
        </SectionHeader>

        {/* Web platforms */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {WEB_PROJECTS.map((p) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal glass group block overflow-hidden rounded-3xl transition-colors hover:border-white/20"
            >
              {/* Browser frame */}
              <div className="relative m-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-2 truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] text-slate-500">
                    {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                </div>
                <div
                  className="relative flex h-44 items-end overflow-hidden p-6 sm:h-52"
                  style={{
                    background: `radial-gradient(80% 90% at 85% 10%, hsla(${p.hue}, 90%, 60%, 0.45), transparent 60%), radial-gradient(60% 70% at 10% 100%, hsla(${(p.hue + 50) % 360}, 85%, 55%, 0.3), transparent 70%), #0c0f1c`,
                  }}
                >
                  <div className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-60" />
                  <div className="relative">
                    <span className="chip border-white/20 bg-black/20 backdrop-blur">{p.badge}</span>
                    <p className="heading mt-3 text-3xl transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                      {p.title}
                    </p>
                  </div>
                  <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-900 transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-3">
                <p className="text-sm leading-relaxed text-slate-300">{p.description}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile apps */}
        <div className="mt-20 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="reveal eyebrow">Mobile portfolio</p>
            <h3 className="reveal heading mt-3 text-3xl sm:text-4xl">Apps we&apos;ve shipped to the App Store</h3>
          </div>
          <p className="reveal max-w-sm text-sm text-slate-400">
            Native and cross-platform apps across travel, health, commerce, music and lifestyle.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {APPS.map((a, i) => (
            <a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal glass group flex flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              style={{ transitionDelay: `${(i % 5) * 50}ms` }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-[14px] font-display text-lg font-bold text-white shadow-card"
                style={{
                  background: `linear-gradient(135deg, hsl(${a.hue}, 85%, 60%), hsl(${(a.hue + 40) % 360}, 80%, 45%))`,
                }}
              >
                {a.name.charAt(0)}
              </span>
              <p className="mt-4 font-display text-base font-semibold tracking-tight text-white">{a.name}</p>
              <p className="text-xs text-slate-500">{a.tag}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
                <Apple className="h-3.5 w-3.5" />
                App Store
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

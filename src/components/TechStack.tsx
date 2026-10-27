import { TECH_STACK } from '@/lib/data';

export function TechStack() {
  // Rendered twice so the marquee can loop seamlessly at -50%.
  const items = [...TECH_STACK, ...TECH_STACK];
  return (
    <section aria-label="Technologies we build with" className="py-16 sm:py-20">
      <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-center">
        <p className="shrink-0 text-sm leading-snug text-slate-500 lg:w-48">
          Our toolkit —
          <br />a modern, battle-tested stack across web, mobile &amp; AI.
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {items.map((t, i) => {
              const Fallback = t.fallback;
              return (
                <li
                  key={`${t.name}-${i}`}
                  aria-hidden={i >= TECH_STACK.length}
                  className="glass flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                    {t.icon ? (
                      <img src={t.icon} alt="" className="h-5 w-5" loading="lazy" />
                    ) : (
                      Fallback && <Fallback className="h-4 w-4 text-ink-900" />
                    )}
                  </span>
                  <span className="whitespace-nowrap text-sm font-medium text-slate-200">{t.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

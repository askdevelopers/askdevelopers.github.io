import { Reveal } from './motion';
import { TECH_GROUPS, TECH_STACK } from '@/lib/data';

export function TechStack() {
  // Rendered twice so the marquee can loop seamlessly at -50%.
  const items = [...TECH_STACK, ...TECH_STACK];
  return (
    <section id="tech" aria-label="Technologies we build with" className="theme-dark py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our toolkit</p>
          <h2 className="headline mt-3 text-3xl sm:text-5xl">A modern, battle-tested stack.</h2>
        </Reveal>
      </div>

      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {items.map((t, i) => {
            const Fallback = t.fallback;
            return (
              <li
                key={`${t.name}-${i}`}
                aria-hidden={i >= TECH_STACK.length}
                className="flex items-center gap-2.5 rounded-full bg-card py-2 pl-2 pr-4"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  {t.icon ? <img src={t.icon} alt="" className="h-5 w-5" loading="lazy" /> : Fallback && <Fallback className="h-4 w-4 text-black" />}
                </span>
                <span className="whitespace-nowrap text-sm font-medium text-fg">{t.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="container-x mt-12">
        <dl className="grid gap-px overflow-hidden rounded-[28px] border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-3">
          {TECH_GROUPS.map((g, i) => (
            <Reveal key={g.group} delay={(i % 3) * 0.06} className="bg-bg p-6 sm:p-7">
              <dt className="eyebrow">{g.group}</dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-fg/85">{g.items.join(' · ')}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

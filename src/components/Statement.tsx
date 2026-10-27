import { Reveal } from './motion';
import { EXPERTISE } from '@/lib/data';

export function Statement() {
  return (
    <section id="about" className="theme-light py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow">About Ask Developers</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="headline mt-4 text-3xl leading-[1.12] sm:text-5xl lg:text-[3.6rem]">
              We <span className="text-gradient-brand">design</span>, build and ship{' '}
              <span className="text-gradient-brand">web, mobile &amp; AI products</span> with people at the core — so
              every release makes your <span className="text-muted">business measurably better.</span>
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 border-t border-line/10 pt-12 md:grid-cols-2 md:gap-16">
          <Reveal className="space-y-4 text-base leading-relaxed text-muted">
            <p>
              <span className="font-medium text-fg">Technology partner. Product mindset. Engineering excellence.</span> We
              work as an embedded engineering partner — shaping scope with you, making architecture decisions in the
              open, and shipping software that holds up in production.
            </p>
            <p>
              From a first idea to a focused MVP, or new capability on a large platform, the approach stays the same:
              understand the product, build for maintainability, and plan for scale.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our expertise spans</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {EXPERTISE.map((e) => (
                <li key={e} className="chip px-3.5 py-1.5 text-sm">
                  {e}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              One team across the full lifecycle — so you don&apos;t coordinate separate vendors for design, mobile,
              web, backend, cloud and AI.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

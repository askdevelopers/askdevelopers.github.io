import { useReveal } from '@/lib/hooks';

export function Statement() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="container-x grid gap-8 lg:grid-cols-[220px_1fr]">
        <p className="reveal">
          <span className="chip gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            About us
          </span>
        </p>
        <p className="reveal heading text-3xl/[1.15] sm:text-4xl/[1.15] lg:text-[3.25rem]/[1.12]">
          We <span className="text-gradient-brand">design</span>, build and ship{' '}
          <span className="text-gradient-brand">web, mobile &amp; AI products</span> with people at the core — so every
          release makes your <span className="text-slate-500">business measurably better.</span>
        </p>
      </div>
    </section>
  );
}

import { ArrowRight, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/data';
import { useReveal } from '@/lib/hooks';

export function CtaBand() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-10 sm:py-16">
      <div className="container-x">
        <div className="reveal relative isolate overflow-hidden rounded-[2rem] bg-brand-gradient px-6 py-12 sm:px-12 sm:py-16">
          <div
            className="absolute -right-28 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 opacity-40 sm:right-10 sm:opacity-100 lg:right-16 lg:h-96 lg:w-96"
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.35),rgba(255,255,255,0.05)_55%,transparent_70%)] shadow-[inset_-30px_-40px_80px_rgba(30,20,90,0.45)]" />
            <div className="dot-sphere absolute inset-0" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">Let&apos;s work together</p>
          <h2 className="heading mt-4 max-w-2xl text-4xl leading-[1.02] sm:text-6xl">
            Turn one idea into your first shipped product.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80">
            Share your requirements and we&apos;ll come back with a clear solution, timeline and cost estimate.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Start your project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <span className="hidden h-6 w-px bg-white/30 sm:block" />
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
              <Phone className="h-4 w-4" />
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

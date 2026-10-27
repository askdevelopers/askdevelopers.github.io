import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

/** Slim intro for the inner pages: breadcrumb, the page's h1 and one line. The sections below carry the detail. */
export function PageHero({ crumb, title, children }: { crumb: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="theme-dark relative isolate overflow-hidden border-b border-white/10 pb-12 pt-14 sm:pb-16 sm:pt-20">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_80%_at_50%_0%,rgba(255,90,31,0.16),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
          <a href="/" className="hover:text-fg">Home</a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-fg/80">{crumb}</span>
        </nav>
        <h1 className="headline mt-4 max-w-3xl text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">{title}</h1>
        {children && <p className="lede mt-4 max-w-2xl text-base sm:text-lg">{children}</p>}
      </div>
    </section>
  );
}

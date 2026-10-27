import type { ReactNode } from 'react';
import { BUSINESS, formatDate } from '@/lib/business';

export type DocSection = { id: string; title: string; children: ReactNode };

/** Long-form page: eyebrow, headline, intro, "last updated", a sticky table of contents and numbered sections. */
export function DocPage({
  eyebrow,
  title,
  intro,
  sections,
  updated = true,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  sections: DocSection[];
  /** Show the "Last updated" line (policy pages). */
  updated?: boolean;
}) {
  return (
    <>
      <section className="container-x pb-12 pt-14 sm:pt-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="headline mt-3 max-w-3xl text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">{title}</h1>
        <div className="lede mt-5 max-w-2xl text-base sm:text-lg">{intro}</div>
        {updated && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Last updated {formatDate(BUSINESS.policiesUpdated)}
          </p>
        )}
      </section>

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="lg:sticky lg:top-20 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">On this page</p>
          <ol className="mt-3 space-y-1 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-block py-1 text-muted transition-colors hover:text-fg">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="doc max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2>
                {i + 1}. {s.title}
              </h2>
              {s.children}
            </section>
          ))}
        </article>
      </section>
    </>
  );
}

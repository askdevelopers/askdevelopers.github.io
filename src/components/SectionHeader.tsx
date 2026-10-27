import type { ReactNode } from 'react';

/** Editorial two-column section header: mono eyebrow + big heading left, supporting copy right. */
export function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
      <div>
        <p className="reveal eyebrow">{eyebrow}</p>
        <h2 className="reveal heading mt-4 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">{title}</h2>
      </div>
      {children && <p className="reveal max-w-md text-base leading-relaxed text-slate-400 lg:justify-self-end">{children}</p>}
    </div>
  );
}

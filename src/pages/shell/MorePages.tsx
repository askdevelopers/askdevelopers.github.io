import { ArrowRight } from 'lucide-react';
import type { PageKey } from '../routes';

const PAGES: { key: PageKey; href: string; title: string; description: string }[] = [
  { key: 'services', href: '/services/', title: 'Services', description: 'Mobile, web, backend, AI, design, CRM and e-commerce.' },
  { key: 'ai', href: '/ai/', title: 'AI & LLMs', description: 'RAG, agents, fine-tuning and Azure deployment.' },
  { key: 'work', href: '/work/', title: 'Work', description: 'Live platforms, shipped apps and case studies.' },
  { key: 'process', href: '/process/', title: 'Process', description: 'Six steps from discovery call to launch.' },
  { key: 'about', href: '/about/', title: 'About', description: 'Who we are and how to reach us.' },
];

/** "Keep exploring" cards at the foot of an inner page, linking to the other inner pages. */
export function MorePages({ current }: { current: PageKey }) {
  return (
    <section className="theme-light py-16 sm:py-20" aria-labelledby="more-pages">
      <div className="container-x">
        <h2 id="more-pages" className="eyebrow">Keep exploring</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PAGES.filter((p) => p.key !== current)
            .slice(0, 4)
            .map((p) => (
              <li key={p.key}>
                <a href={p.href} className="group flex h-full flex-col rounded-[24px] bg-card p-5 shadow-tile transition-shadow hover:shadow-tile-hover">
                  <span className="flex items-center justify-between font-display text-lg font-semibold tracking-tight text-fg">
                    {p.title}
                    <ArrowRight className="h-4 w-4 text-link transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-1 text-sm text-muted">{p.description}</span>
                </a>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

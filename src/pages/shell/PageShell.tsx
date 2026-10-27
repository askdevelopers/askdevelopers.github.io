import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { PageHeader } from './PageHeader';

/** Header + light content area + footer for every stand-alone page. No scroll-linked motion, so it renders on the server. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 text-[#f4efe6]">
      <PageHeader />
      <main className="theme-light">{children}</main>
      <Footer home={false} />
    </div>
  );
}

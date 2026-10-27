import { Logo } from '@/components/Logo';
import { NAV_LINKS } from '@/lib/data';

const LINKS = NAV_LINKS.filter((l) => l.href !== '/#contact');

/** Thin dark bar for the stand-alone pages: logo home, a few links, and the call-to-action. */
export function PageHeader() {
  return (
    <header className="theme-dark sticky top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <nav className="container-x flex h-14 items-center justify-between gap-4">
        <a href="/" aria-label="Ask Developers home" className="shrink-0">
          <Logo />
        </a>
        <ul className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] text-white/80 transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/#contact" className="btn-primary !px-4 !py-1.5 !text-[13px]">
          Book a call
        </a>
      </nav>
      {/* Phones: the same links as a scrollable row under the bar. */}
      <ul className="no-scrollbar container-x flex gap-5 overflow-x-auto border-t border-white/10 sm:hidden">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="inline-flex min-h-[40px] items-center whitespace-nowrap text-[13px] text-white/80 hover:text-white">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}

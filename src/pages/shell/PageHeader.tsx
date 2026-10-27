import { Logo } from '@/components/Logo';

const LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about/' },
  { label: 'Support', href: '/support/' },
];

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
    </header>
  );
}

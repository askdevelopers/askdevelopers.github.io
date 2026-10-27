import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_LINKS } from '@/lib/data';
import { useScrolled } from '@/lib/hooks';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(16);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border px-3 pl-4 transition-all duration-300 sm:px-4 sm:pl-5 ${
          scrolled || open
            ? 'border-white/10 bg-ink-900/80 shadow-card backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#home" aria-label="Ask Developers home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block rounded-full px-4 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.03] md:inline-flex"
        >
          Book a call
          <ArrowUpRight className="h-4 w-4" />
        </a>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-200 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden ${
          open ? 'max-h-[28rem] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-1 p-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-base text-slate-200 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Book a call
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

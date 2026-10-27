import { ArrowUpRight, Facebook, Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { CONTACT, NAV_LINKS, SERVICES } from '@/lib/data';
import { COMPANY_LINKS } from '@/pages/routes';

/** `home` is false on the stand-alone pages, where in-page anchors must point back at the home page. */
export function Footer({ home = true }: { home?: boolean }) {
  const to = (href: string) => (home || !href.startsWith('#') ? href : `/${href}`);
  return (
    <footer className="theme-light relative overflow-hidden border-t border-line/10 pt-14">
      <div className="container-x">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_1.2fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A full-service software development company building web, mobile and AI products that scale.
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted">
              Ideas · Products · People · Progress
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">Explore</h3>
            <ul className="mt-2.5 space-y-0.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={to(l.href)} className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-fg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">Services</h3>
            <ul className="mt-2.5 space-y-0.5">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <a href={to('#services')} className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-fg">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">Company</h3>
            <ul className="mt-2.5 space-y-0.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-fg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">Get in touch</h3>
            <ul className="mt-2.5 space-y-1">
              <li>
                <a href={CONTACT.phoneHref} className="flex items-center gap-3 py-1.5 text-sm text-muted hover:text-fg">
                  <Phone className="h-4 w-4 text-link" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 break-all py-1.5 text-sm text-muted hover:text-fg">
                  <Mail className="h-4 w-4 shrink-0 text-link" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-1.5 text-sm text-muted hover:text-fg"
                >
                  <Facebook className="h-4 w-4 text-link" />
                  Facebook
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line/10 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ask Developers. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="/privacy/" className="py-1 hover:text-fg">Privacy</a>
            <a href="/terms/" className="py-1 hover:text-fg">Terms</a>
            <a href="/refund-policy/" className="py-1 hover:text-fg">Refunds</a>
            <a href="/delete-account/" className="py-1 hover:text-fg">Delete account</a>
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">Web · Mobile · AI</p>
        </div>
      </div>

      <p
        className="pointer-events-none select-none whitespace-nowrap bg-gradient-to-b from-fg/[0.08] to-transparent bg-clip-text pt-2 text-center font-display text-[13.5vw] font-bold leading-[0.8] tracking-[-0.05em] text-transparent"
        aria-hidden="true"
      >
        Ask Developers
      </p>
    </footer>
  );
}

import { ArrowUpRight, Facebook, Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { CONTACT, NAV_LINKS } from '@/lib/data';

export function Footer() {
  return (
    <footer className="relative overflow-hidden pt-10">
      <div className="container-x">
        <div className="glass rounded-[2rem] p-6 sm:p-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                A full-service software development agency building web, mobile, and AI products that scale.
              </p>
              <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-slate-500">
                Ideas · Products · People · Progress
              </p>
            </div>

            <div>
              <h3 className="eyebrow">Explore</h3>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-slate-300 transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow">Get in touch</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={CONTACT.phoneHref} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white">
                    <Phone className="h-4 w-4 text-brand-300" />
                    {CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 break-all text-sm text-slate-300 hover:text-white">
                    <Mail className="h-4 w-4 shrink-0 text-brand-300" />
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-white"
                  >
                    <Facebook className="h-4 w-4 text-brand-300" />
                    Facebook
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Ask Developers. All rights reserved.</p>
            <p className="font-mono uppercase tracking-[0.2em]">Web · Mobile · AI</p>
          </div>
        </div>
      </div>

      <p
        className="pointer-events-none select-none whitespace-nowrap bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text pt-4 text-center font-display text-[13.5vw] font-bold leading-[0.8] tracking-[-0.05em] text-transparent"
        aria-hidden="true"
      >
        Ask Developers
      </p>
    </footer>
  );
}

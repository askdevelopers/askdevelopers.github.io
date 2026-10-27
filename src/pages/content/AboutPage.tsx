import { ArrowUpRight, Facebook, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { addressLines, BUSINESS, CONTACT } from '@/lib/business';
import { SERVICES, STATS, WHY_CHOOSE } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

/** Who the business is: what Google Ads, Google Business Profile and the stores look for when they verify an advertiser or developer. */
export function AboutPage() {
  const address = addressLines();
  const host = SITE_URL.replace(/^https?:\/\//, '');
  return (
    <>
      <section className="container-x pb-14 pt-14 sm:pt-24">
        <p className="eyebrow">About</p>
        <h1 className="headline mt-3 max-w-4xl text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
          A software partner for businesses that want to ship.
        </h1>
        <p className="lede mt-5 max-w-2xl text-base sm:text-lg">
          {BUSINESS.name} is a software development company based in {BUSINESS.address.country}. We design, build and
          maintain mobile apps, web platforms and AI products for startups and established businesses around the world,
          and we publish apps of our own on the App Store and Google Play.
        </p>
      </section>

      <section className="container-x pb-16">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-[28px] bg-card p-6 shadow-tile">
              <dd className="font-display text-4xl font-semibold tracking-tight text-fg">{s.value}</dd>
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="headline text-3xl sm:text-4xl">What we do</h2>
          <p className="mt-4 text-base leading-relaxed text-fg/80">
            One team covers the whole product: UI/UX design, mobile and web engineering, backend and cloud, AI
            integration, launch and ongoing support. Clients get a single partner instead of a chain of vendors.
          </p>
          <ul className="mt-6 space-y-2">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <a href="/#services" className="group flex items-center justify-between gap-4 rounded-2xl border border-line/10 px-4 py-3 text-sm font-medium text-fg transition-colors hover:bg-fg/5">
                  {s.title}
                  <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="headline text-3xl sm:text-4xl">How we work</h2>
          <ul className="mt-6 space-y-5">
            {WHY_CHOOSE.slice(0, 6).map((w) => (
              <li key={w.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <w.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-fg">{w.title}</span>
                  <span className="mt-0.5 block text-sm text-fg/75">{w.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="rounded-[28px] bg-ink-900 p-6 text-[#f4efe6] sm:p-10" style={{ ['--c-fg' as string]: '244 239 230', ['--c-muted' as string]: '154 148 138', ['--c-link' as string]: '255 110 56' }}>
          <p className="eyebrow">Company details</p>
          <h2 className="headline mt-2 text-2xl sm:text-3xl">{BUSINESS.legalName}</h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-link" />
              <div>
                <dt className="text-xs text-muted">Email</dt>
                <dd className="mt-0.5 break-all text-sm">
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-link">{CONTACT.email}</a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-link" />
              <div>
                <dt className="text-xs text-muted">Phone</dt>
                <dd className="mt-0.5 text-sm">
                  <a href={CONTACT.phoneHref} className="hover:text-link">{CONTACT.phone}</a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-link" />
              <div>
                <dt className="text-xs text-muted">Website</dt>
                <dd className="mt-0.5 text-sm">
                  <a href={`${SITE_URL}/`} className="hover:text-link">{host}</a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Facebook className="mt-0.5 h-4 w-4 shrink-0 text-link" />
              <div>
                <dt className="text-xs text-muted">Facebook</dt>
                <dd className="mt-0.5 text-sm">
                  <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-link">
                    facebook.com/ask.dev.58
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-link" />
              <div>
                <dt className="text-xs text-muted">Location</dt>
                <dd className="mt-0.5 text-sm">
                  {address.length > 0 ? (
                    <address className="not-italic">
                      {address.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </address>
                  ) : (
                    <>Based in {BUSINESS.address.country}, working with clients worldwide.</>
                  )}
                  {BUSINESS.hours.label && <span className="mt-1 block text-muted">{BUSINESS.hours.label}</span>}
                </dd>
              </div>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/#contact" className="btn-primary">Start a project</a>
            <a href="/support/" className="btn-ghost">Get support</a>
          </div>
        </div>
      </section>
    </>
  );
}

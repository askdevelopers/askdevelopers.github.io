import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { addressLines, BUSINESS, CONTACT } from '@/lib/business';
import { COMPANY_LINKS } from '../routes';

const FAQ = [
  {
    q: 'An app is crashing or a feature is not working',
    a: 'Update the app to the latest version from Google Play or the App Store and restart your device. If the problem continues, email us the app name and version, your device model and OS version, and what you were doing when it happened. Screenshots or a screen recording help a lot.',
  },
  {
    q: 'I want to delete my account or my data',
    a: 'You can delete your account from inside the app, or send us a request by email. The steps, what is removed and how long it takes are on the Delete your account page.',
    href: '/delete-account/',
    cta: 'Delete your account',
  },
  {
    q: 'I was charged and want a refund',
    a: 'Purchases made through Google Play or the App Store are refunded by Google or Apple under their rules; our Refund & Cancellation Policy explains how to request one and what applies to project payments.',
    href: '/refund-policy/',
    cta: 'Refund & Cancellation Policy',
  },
  {
    q: 'I have a question about my project, proposal or invoice',
    a: 'Email us with the project name and we will reply from the team working on it. For a new project, use the contact form on the home page and we will come back with a plan, timeline and estimate.',
    href: '/#contact',
    cta: 'Start a project',
  },
  {
    q: 'I found a security issue',
    a: 'Please email us with "Security" in the subject line and do not post the details publicly. We acknowledge reports within 2 business days and keep you informed while we fix the issue.',
  },
  {
    q: 'Where are your privacy policy and terms?',
    a: 'Every policy that applies to the website and our apps is linked from this page and from the footer of every page.',
    href: '/privacy/',
    cta: 'Privacy Policy',
  },
];

/** App Store "Support URL" and Play Console support contact point here: how to reach us, what to include, common questions. */
export function SupportPage() {
  const address = addressLines();
  return (
    <>
      <section className="container-x pb-12 pt-14 sm:pt-24">
        <p className="eyebrow">Support</p>
        <h1 className="headline mt-3 max-w-3xl text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">How can we help?</h1>
        <p className="lede mt-5 max-w-2xl text-base sm:text-lg">
          Help with any app published by {BUSINESS.name}, with a project we are building for you, or with your account.
          We answer every message {BUSINESS.supportResponse}.
        </p>
      </section>

      <section className="container-x pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Support request')}`} className="group flex items-start gap-4 rounded-[28px] bg-card p-6 shadow-tile transition-shadow hover:shadow-tile-hover">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white">
              <Mail className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Email, the fastest way</span>
              <span className="mt-1 block break-all text-base font-semibold text-fg">{CONTACT.email}</span>
              <span className="mt-1 block text-xs text-muted">Reply {BUSINESS.supportResponse}</span>
            </span>
            <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a href={CONTACT.phoneHref} className="group flex items-start gap-4 rounded-[28px] bg-card p-6 shadow-tile transition-shadow hover:shadow-tile-hover">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-800 text-white">
              <Phone className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Call or WhatsApp</span>
              <span className="mt-1 block text-base font-semibold text-fg">{CONTACT.phone}</span>
              <span className="mt-1 block text-xs text-muted">
                {BUSINESS.hours.label || 'Business hours, Indian Standard Time'}
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          {address.length > 0 && (
            <div className="flex items-start gap-4 rounded-[28px] bg-card p-6 shadow-tile">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-800 text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <address className="not-italic">
                <span className="block text-xs text-muted">Office</span>
                {address.map((line) => (
                  <span key={line} className="mt-1 block text-sm text-fg">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          )}
          {BUSINESS.hours.label && (
            <div className="flex items-start gap-4 rounded-[28px] bg-card p-6 shadow-tile">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-800 text-white">
                <Clock className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-muted">Hours</span>
                <span className="mt-1 block text-sm text-fg">{BUSINESS.hours.label}</span>
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-[28px] border border-line/10 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-fg">What to include so we can help quickly</h2>
          <ul className="mt-3 grid gap-2 text-sm text-fg/80 sm:grid-cols-2">
            <li>The app name and version (Settings → About in the app)</li>
            <li>Your device model and OS version</li>
            <li>The email address or phone number on your account</li>
            <li>What you did, what you expected, and what happened instead</li>
            <li>Screenshots or a screen recording, if you have them</li>
            <li>For projects: the project or invoice name</li>
          </ul>
        </div>
      </section>

      <section className="container-x pb-24">
        <h2 className="headline text-3xl sm:text-4xl">Common questions</h2>
        <div className="mt-8 divide-y divide-line/10 border-y border-line/10">
          {FAQ.map((item) => (
            <div key={item.q} className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
              <h3 className="text-base font-semibold text-fg">{item.q}</h3>
              <div>
                <p className="text-sm leading-relaxed text-fg/80">{item.a}</p>
                {item.href && (
                  <a href={item.href} className="link-arrow mt-1">
                    {item.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {COMPANY_LINKS.filter((l) => l.href !== '/support/').map((l) => (
            <a key={l.href} href={l.href} className="py-1.5 text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

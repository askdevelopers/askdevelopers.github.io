import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { addressLines, BUSINESS, CONTACT } from '@/lib/business';

export const EmailLink = ({ subject }: { subject?: string }) => (
  <a href={`mailto:${CONTACT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}>{CONTACT.email}</a>
);

export const PhoneLink = () => <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>;

/** Email, phone and (once filled in) address and hours, as a card. The same block is used on every page that must name the business. */
export function ContactDetails({ className = '' }: { className?: string }) {
  const address = addressLines();
  return (
    <div className={`not-doc rounded-[28px] bg-card p-6 shadow-tile sm:p-8 ${className}`}>
      <p className="text-sm font-semibold text-fg">{BUSINESS.legalName}</p>
      <ul className="mt-4 space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-link" />
          <a href={`mailto:${CONTACT.email}`} className="break-all text-fg hover:text-link">
            {CONTACT.email}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-link" />
          <a href={CONTACT.phoneHref} className="text-fg hover:text-link">
            {CONTACT.phone}
          </a>
        </li>
        {address.length > 0 && (
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-link" />
            <address className="not-italic text-fg">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </li>
        )}
        {BUSINESS.hours.label && (
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-link" />
            <span className="text-fg">{BUSINESS.hours.label}</span>
          </li>
        )}
      </ul>
    </div>
  );
}

/**
 * Business identity. Everything a store listing, ads account, directory or legal page asks for is read
 * from here: the footer, About, Support, the policy pages and the Organization structured data on the
 * home page. Keep these values identical to Google Business Profile, Play Console and App Store Connect.
 */

/** Email is the only published contact channel; no phone number appears anywhere on the site. */
export const CONTACT = {
  email: 'askdevelopers001@gmail.com',
  facebook: 'https://www.facebook.com/ask.dev.58/',
} as const;

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  /** ISO 3166-1 alpha-2 code, used in structured data. */
  countryCode: string;
};

export type Business = {
  name: string;
  /** Registered name on invoices and the store developer accounts, when it differs from the brand name. */
  legalName: string;
  description: string;
  /** Postal address. Fill it in once; empty lines are left out everywhere. */
  address: Address;
  /** `label` is shown to people; `schema` is the schema.org form, e.g. "Mo-Sa 10:00-19:00". Empty = hidden. */
  hours: { label: string; schema: string; timezone: string };
  /** First-reply promise shown on the Support page. */
  supportResponse: string;
  /** ISO date shown as "Last updated" on every policy page. Bump it whenever a policy changes. */
  policiesUpdated: string;
  /** Courts that settle disputes under the Terms; the city is optional. */
  jurisdiction: { city: string; country: string };
};

export const BUSINESS: Business = {
  name: 'Ask Developers',
  legalName: 'Ask Developers',
  description:
    'Full-service software development company building mobile apps, web platforms, AI products, SaaS, e-commerce and CRM systems for businesses worldwide.',
  address: { street: '', city: '', state: '', postalCode: '', country: 'India', countryCode: 'IN' },
  hours: { label: '', schema: '', timezone: 'Asia/Kolkata' },
  supportResponse: 'within one business day',
  policiesUpdated: '2026-10-27',
  jurisdiction: { city: '', country: 'India' },
};

/** Non-empty address lines ready to print; empty until a street, city or postcode has been filled in. */
export function addressLines(a: Address = BUSINESS.address): string[] {
  if (!a.street && !a.city && !a.postalCode) return [];
  const cityLine = [a.city, a.state].filter(Boolean).join(', ');
  return [a.street, [cityLine, a.postalCode].filter(Boolean).join(' '), a.country].filter(Boolean);
}

/** Where disputes are heard, as written in the Terms. */
export function jurisdictionLabel(j = BUSINESS.jurisdiction): string {
  return j.city ? `${j.city}, ${j.country}` : j.country;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2026-10-27" -> "27 October 2026". Deterministic, so server and client markup match. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

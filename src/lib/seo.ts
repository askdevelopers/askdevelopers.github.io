import { BUSINESS, CONTACT } from './business';

/**
 * schema.org Organization for the home page. Google Ads, Google Business Profile and Search all read this
 * to match the site with the business; address and hours appear as soon as they are filled in.
 */
export function organizationJsonLd(siteUrl: string) {
  const a = BUSINESS.address;
  const hasAddress = Boolean(a.street || a.city || a.postalCode);
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${siteUrl}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/favicon.svg`,
    image: `${siteUrl}/og.svg`,
    description: BUSINESS.description,
    slogan: 'We Build Technology That Moves Businesses Forward.',
    email: CONTACT.email,
    sameAs: [CONTACT.facebook],
    areaServed: 'Worldwide',
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: a.street,
        addressLocality: a.city,
        addressRegion: a.state,
        postalCode: a.postalCode,
        addressCountry: a.countryCode,
      },
    }),
    ...(BUSINESS.hours.schema && { openingHours: BUSINESS.hours.schema }),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT.email,
        url: `${siteUrl}/support/`,
        availableLanguage: ['en', 'hi'],
      },
    ],
    serviceType: [
      'Mobile App Development',
      'Web Development',
      'AI Development',
      'UI/UX Design',
      'Backend & API Development',
      'E-commerce Development',
      'CRM Development',
    ],
  };
}

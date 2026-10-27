/**
 * Every stand-alone page besides the home page. Each one is a real HTML file in dist/, so stores, ads
 * reviewers and crawlers get a 200 with the full content and no JavaScript required.
 *
 * Adding a page: add an entry here, a shell `<dir>/index.html` (copy an existing one and change
 * data-page), and a component in src/pages/content registered in src/pages/registry.tsx.
 */
export type PageKey = 'about' | 'support' | 'privacy' | 'terms' | 'refund' | 'delete-account' | 'not-found';

export type PageRoute = {
  key: PageKey;
  /** Public path. Directories end with a slash: GitHub Pages serves `<dir>/index.html` there. */
  path: string;
  /** HTML shell relative to the repo root; also its output path inside dist/. */
  file: string;
  /** Page title; the site name is appended by the build. */
  title: string;
  description: string;
  /** Short label for footer links. */
  navLabel: string;
  /** Indexable and listed in sitemap.xml. */
  index: boolean;
};

export const PAGE_ROUTES: PageRoute[] = [
  {
    key: 'about',
    path: '/about/',
    file: 'about/index.html',
    title: 'About Ask Developers',
    description:
      'Ask Developers is a software development company in India building mobile apps, web platforms and AI products for clients worldwide. Company details, how we work and who we are.',
    navLabel: 'About',
    index: true,
  },
  {
    key: 'support',
    path: '/support/',
    file: 'support/index.html',
    title: 'Support',
    description:
      'Get help with any Ask Developers app, your project or your account. Email and phone support with a reply within one business day.',
    navLabel: 'Support',
    index: true,
  },
  {
    key: 'privacy',
    path: '/privacy/',
    file: 'privacy/index.html',
    title: 'Privacy Policy',
    description:
      'How Ask Developers collects, uses, shares and protects personal data on our website and in our mobile apps, and the rights you have over it.',
    navLabel: 'Privacy Policy',
    index: true,
  },
  {
    key: 'terms',
    path: '/terms/',
    file: 'terms/index.html',
    title: 'Terms & Conditions',
    description:
      'The terms that govern use of the Ask Developers website, our mobile apps and the software development services we provide.',
    navLabel: 'Terms & Conditions',
    index: true,
  },
  {
    key: 'refund',
    path: '/refund-policy/',
    file: 'refund-policy/index.html',
    title: 'Refund & Cancellation Policy',
    description:
      'When and how Ask Developers refunds payments for development services, app purchases and subscriptions, and how to cancel.',
    navLabel: 'Refund Policy',
    index: true,
  },
  {
    key: 'delete-account',
    path: '/delete-account/',
    file: 'delete-account/index.html',
    title: 'Delete your account',
    description:
      'How to delete your account and personal data from any app published by Ask Developers, what is removed, what is kept and how long it takes.',
    navLabel: 'Delete account',
    index: true,
  },
  {
    key: 'not-found',
    path: '/404.html',
    file: '404.html',
    title: 'Page not found',
    description: 'The page you were looking for does not exist.',
    navLabel: 'Not found',
    index: false,
  },
];

/** Footer / header links to the public pages, in display order. */
export const COMPANY_LINKS = PAGE_ROUTES.filter((r) => r.index).map((r) => ({ label: r.navLabel, href: r.path }));

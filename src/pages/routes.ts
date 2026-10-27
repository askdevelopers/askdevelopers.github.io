/**
 * Every stand-alone page besides the home page. Each one is a real HTML file in dist/, so stores, ads
 * reviewers and crawlers get a 200 with the full content and no JavaScript required.
 *
 * Adding a page: add an entry here, a shell `<dir>/index.html` (copy an existing one and change
 * data-page), and a component in src/pages/content registered in src/pages/registry.tsx.
 */
export type PageKey = 'services' | 'ai' | 'work' | 'process' | 'about' | 'support' | 'privacy' | 'terms' | 'refund' | 'delete-account' | 'not-found';

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
  /** Footer column: the inner product pages ("explore") or the company and policy pages. */
  group: 'explore' | 'company';
};

export const PAGE_ROUTES: PageRoute[] = [
  {
    key: 'services',
    path: '/services/',
    file: 'services/index.html',
    title: 'Services',
    description:
      'Mobile, web, backend, AI, UI/UX, CRM and e-commerce development from one senior team. What we build, the solutions we deliver and the stack we use.',
    navLabel: 'Services',
    index: true,
    group: 'explore',
  },
  {
    key: 'ai',
    path: '/ai/',
    file: 'ai/index.html',
    title: 'AI & LLM Development',
    description:
      'LLM integration, RAG, AI agents, fine-tuning and Azure deployment. Ask Developers builds AI features that work in production, on your data.',
    navLabel: 'AI',
    index: true,
    group: 'explore',
  },
  {
    key: 'work',
    path: '/work/',
    file: 'work/index.html',
    title: 'Work & Case Studies',
    description:
      'CRMs, e-commerce platforms and 12+ apps live on the App Store and Play Store. Selected work and case studies from Ask Developers.',
    navLabel: 'Work',
    index: true,
    group: 'explore',
  },
  {
    key: 'process',
    path: '/process/',
    file: 'process/index.html',
    title: 'How We Work',
    description:
      'Six clear steps from discovery call to launch and ongoing support, and why teams choose Ask Developers as their technology partner.',
    navLabel: 'Process',
    index: true,
    group: 'explore',
  },
  {
    key: 'about',
    path: '/about/',
    file: 'about/index.html',
    title: 'About Ask Developers',
    description:
      'Ask Developers is a software development company in India building mobile apps, web platforms and AI products for clients worldwide. Company details, how we work and who we are.',
    navLabel: 'About',
    index: true,
    group: 'company',
  },
  {
    key: 'support',
    path: '/support/',
    file: 'support/index.html',
    title: 'Support',
    description:
      'Get help with any Ask Developers app, your project or your account. Email support with a reply within one business day.',
    navLabel: 'Support',
    index: true,
    group: 'company',
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
    group: 'company',
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
    group: 'company',
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
    group: 'company',
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
    group: 'company',
  },
  {
    key: 'not-found',
    path: '/404.html',
    file: '404.html',
    title: 'Page not found',
    description: 'The page you were looking for does not exist.',
    navLabel: 'Not found',
    index: false,
    group: 'company',
  },
];

const links = (group: PageRoute['group']) =>
  PAGE_ROUTES.filter((r) => r.index && r.group === group).map((r) => ({ label: r.navLabel, href: r.path }));

/** Footer links to the company and policy pages, in display order. */
export const COMPANY_LINKS = links('company');

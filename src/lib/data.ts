import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Boxes,
  CalendarCheck,
  Code2,
  Globe,
  Handshake,
  LayoutDashboard,
  Layers,
  LifeBuoy,
  MessagesSquare,
  PenTool,
  PencilRuler,
  Phone,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react';

/** Contact details and business identity live in business.ts (shared with the build and the policy pages). */
export { CONTACT, BUSINESS } from './business';

/** Header links: the inner pages, then the contact form on the home page. */
export const NAV_LINKS = [
  { label: 'Services', href: '/services/' },
  { label: 'AI', href: '/ai/' },
  { label: 'Work', href: '/work/' },
  { label: 'Process', href: '/process/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/#contact' },
];

/** Stops on the scroll rail, in home-page order. */
export const PAGE_SECTIONS = [
  { id: 'home', label: 'Start' },
  { id: 'platform', label: 'What we build' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'why', label: 'Why us' },
  { id: 'contact', label: 'Contact' },
];

/** Steps of the pinned "one partner, every platform" story. */
export const PLATFORM_STEPS = [
  {
    key: 'ai',
    href: '/ai/',
    cta: 'Explore AI',
    eyebrow: 'AI platform',
    title: 'Intelligence, built in.',
    description:
      'LLM integration, RAG, agents, fine-tuned models and document intelligence — wired into your product, not bolted on, on Azure or the cloud you already run.',
    chips: ['LLMs', 'RAG', 'AI agents', 'Azure OpenAI'],
  },
  {
    key: 'web',
    href: '/services/#web-full-stack-development',
    cta: 'Web & SaaS services',
    eyebrow: 'Web & SaaS',
    title: 'Platforms that run the business.',
    description:
      'SaaS products, dashboards, marketplaces and enterprise apps on React, Next.js, Node.js and Laravel — fast, secure and built to scale.',
    chips: ['React', 'Next.js', 'Node.js', 'Laravel'],
  },
  {
    key: 'mobile',
    href: '/work/#apps',
    cta: 'See our apps',
    eyebrow: 'iOS · Android · Flutter',
    title: 'Apps people keep.',
    description:
      'Native Swift and Kotlin, or cross-platform Flutter and React Native. 12+ apps live on the App Store and Play Store, from travel rewards to wearables.',
    chips: ['Swift', 'Kotlin', 'Flutter', 'React Native'],
  },
  {
    key: 'crm',
    href: '/work/#case-studies',
    cta: 'See CRM case study',
    eyebrow: 'CRM & business apps',
    title: 'Your workflow, as software.',
    description:
      'Custom CRMs, admin panels, role-based access, lead pipelines and reporting — built around how your team actually works.',
    chips: ['Lead management', 'RBAC', 'Reporting', 'Automation'],
  },
];

export const STATS = [
  { value: '12+', label: 'Apps live on App Store & Play Store' },
  { value: '15+', label: 'Web platforms shipped' },
  { value: '12+', label: 'Technologies mastered' },
  { value: '24h', label: 'Typical first response' },
];

export type Service = {
  icon: LucideIcon;
  /** Anchor of the full card on /services/. */
  slug: string;
  title: string;
  description: string;
  points: string[];
  /** Technologies shown as a mono line at the bottom of the card. */
  stack: string[];
  /** Visual treatment of the card — mirrors the alternating cards in the design references. */
  tone?: 'default' | 'light' | 'featured';
};

export const SERVICES: Service[] = [
  {
    icon: Smartphone,
    slug: 'ios-android-app-development',
    title: 'iOS & Android App Development',
    description:
      'Native iOS (Swift) and Android (Kotlin) apps engineered for performance, security, and a polished user experience.',
    points: ['App Store & Play Store launch', 'Payments & push', 'Maps & real-time'],
    stack: ['Swift', 'SwiftUI', 'UIKit', 'Kotlin', 'Java'],
    tone: 'light',
  },
  {
    icon: Layers,
    slug: 'hybrid-app-development',
    title: 'Hybrid App Development',
    description: 'One codebase, every platform — Flutter and React Native apps that feel native on iOS and Android.',
    points: ['Shared codebase', 'Native modules', 'Fast iteration'],
    stack: ['Flutter', 'React Native'],
  },
  {
    icon: Globe,
    slug: 'web-full-stack-development',
    title: 'Web & Full-Stack Development',
    description:
      'Business websites, SaaS platforms, dashboards and marketplaces — MERN, Next.js or Laravel, built to scale.',
    points: ['SaaS & marketplaces', 'Dashboards', 'Enterprise apps'],
    stack: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PHP', 'Laravel'],
  },
  {
    icon: Server,
    slug: 'backend-api-development',
    title: 'Backend & API Development',
    description: 'Secure, well-architected backends and APIs — authentication, payments, real-time and integrations.',
    points: ['REST & GraphQL APIs', 'Queues & microservices', 'Database design'],
    stack: ['Node.js', 'NestJS', 'Laravel', 'Java', 'PostgreSQL', 'Redis'],
  },
  {
    icon: Sparkles,
    slug: 'ai-generative-ai',
    title: 'AI & Generative AI',
    description:
      'Integrate GPT, Claude, and open-source LLMs into your product — chatbots, RAG, agents, and automation.',
    points: ['RAG & vector search', 'AI agents', 'Document intelligence'],
    stack: ['LLMs', 'RAG', 'Vector DBs', 'Azure OpenAI'],
    tone: 'featured',
  },
  {
    icon: PenTool,
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    description:
      'User-centered design that looks beautiful and converts — research, wireframes, prototypes, and design systems.',
    points: ['UX research', 'Figma prototypes', 'Design systems'],
    stack: ['Figma', 'Prototyping', 'Usability testing'],
  },
  {
    icon: LayoutDashboard,
    slug: 'crm-business-applications',
    title: 'CRM & Business Applications',
    description: 'Custom CRMs and admin panels built around your workflows — roles, permissions, leads and reporting.',
    points: ['RBAC & permissions', 'Lead management', 'Dashboards & reports'],
    stack: ['Laravel', 'Node.js', 'React', 'MySQL'],
  },
  {
    icon: ShoppingCart,
    slug: 'e-commerce-development',
    title: 'E-commerce Development',
    description: 'Conversion-focused online stores with payments, shipments, inventory, and a powerful admin panel.',
    points: ['Payments & shipping', 'Inventory & orders', 'SEO-ready'],
    stack: ['Custom', 'Shopify', 'Laravel', 'React'],
  },
];

export type AppItem = {
  name: string;
  /** App Store listing. */
  url: string;
  /** Google Play listing, when the app is on Android too. */
  playUrl?: string;
  tag: string;
  hue: number;
  description?: string;
};

export const APPS: AppItem[] = [
  { name: 'Miles', url: 'https://apps.apple.com/us/app/miles-travel-shop-get-cash/id1393913947', tag: 'Travel', hue: 210, description: 'Rewards for everyday travel and shopping.' },
  { name: 'Fitburn', url: 'https://apps.apple.com/us/app/fitburn-watch/id6502515644', tag: 'Health & Fitness', hue: 12, description: 'Workout tracking across iPhone and Apple Watch.' },
  { name: 'Stored', url: 'https://apps.apple.com/in/app/stored-social-shopping/id1663518540', tag: 'Social Shopping', hue: 275, description: 'Social feed meets product discovery.' },
  { name: 'Flocco', url: 'https://apps.apple.com/in/app/flocco/id1629581523', tag: 'Fashion', hue: 165 },
  { name: 'Adawatie', url: 'https://apps.apple.com/in/app/adawatie/id1473815126', tag: 'Lifestyle', hue: 40 },
  { name: 'Soniq', url: 'https://apps.apple.com/in/app/soniq-your-music-companion/id6744140818', tag: 'Music', hue: 235, description: 'Discover and share what you listen to.' },
  { name: 'Meal ID', url: 'https://apps.apple.com/us/app/meal-id-meal-prep-planner/id1504099975', tag: 'Food & Drink', hue: 95, description: 'Structured meal planning and prep.' },
  { name: 'Palace', url: 'https://apps.apple.com/gb/app/palaceapp/id1439058382', tag: 'Lifestyle', hue: 300 },
  { name: 'LilRequester', url: 'https://apps.apple.com/us/app/lil-requester/id1488416772', tag: 'Productivity', hue: 190 },
  { name: 'Dynamite Travel', url: 'https://apps.apple.com/us/app/dynamite-travel-1-0/id998736815', tag: 'Travel', hue: 20, description: 'Plan and book journeys.' },
];

export type WebProject = {
  title: string;
  url: string;
  description: string;
  features: string[];
  badge: string;
  hue: number;
};

export const WEB_PROJECTS: WebProject[] = [
  {
    title: 'Breakdown CRM',
    url: 'https://breakdown.laravue.in/',
    description: 'Business website with a powerful CRM/Admin panel for managing leads and operations end-to-end.',
    features: [
      'Lead management from website forms and Excel imports',
      'Employee management with Roles & Permissions (RBAC)',
      'Complete CRM workflow for business operations',
    ],
    badge: 'CRM + Laravel',
    hue: 220,
  },
  {
    title: 'Abhinaya Creations',
    url: 'https://abhinayacreations.in/',
    description: 'Complete e-commerce platform for Rajasthan handicrafts with full admin and content management.',
    features: [
      'Product, category, order, payment & shipment management',
      'Fully featured admin panel with dynamic content management',
    ],
    badge: 'E-commerce',
    hue: 25,
  },
  {
    title: 'Glowing Fusions',
    url: 'https://www.glowingfusions.com/',
    description: 'Jewellery & gifting e-commerce website with a custom gift-creation feature and mobile-first design.',
    features: ['Custom gift creation feature', 'Mobile-first responsive design', 'Mobile app currently under development'],
    badge: 'E-commerce + App',
    hue: 290,
  },
  {
    title: 'Glanz Interiors',
    url: 'https://glanz.laravue.in/',
    description: 'Interior design portfolio website with a custom admin panel to manage all content without coding.',
    features: [
      'Custom admin panel to manage all website content',
      'Editable products, services, banners, and pages without coding',
    ],
    badge: 'Portfolio + CMS',
    hue: 160,
  },
];

export const PROCESS_STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Phone, title: 'Discovery Call', description: 'We discuss your goals, audience, and scope to understand exactly what success looks like.' },
  { icon: PencilRuler, title: 'Planning & Design', description: 'Wireframes, architecture, and high-fidelity UI — aligned before a single line of code.' },
  { icon: Code2, title: 'Development', description: 'Clean, scalable code with weekly demos and continuous feedback loops.' },
  { icon: ShieldCheck, title: 'Testing & QA', description: 'Automated and manual testing across devices to ensure reliability and security.' },
  { icon: Rocket, title: 'Deployment', description: 'Smooth launch to production with zero downtime and full handover documentation.' },
  { icon: LifeBuoy, title: 'Ongoing Support', description: 'Maintenance, updates, and feature growth — we stay your technology partner.' },
];

export const WHY_CHOOSE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Target, title: 'Product-Focused Engineering', description: 'We understand the product, users and business goals — not just the ticket.' },
  { icon: Workflow, title: 'End-to-End Development', description: 'UI/UX, architecture, development, deployment and maintenance under one roof.' },
  { icon: Boxes, title: 'Multi-Technology Expertise', description: 'Mobile, web, backend, cloud and AI — no juggling separate vendors.' },
  { icon: Sparkles, title: 'Clean UI', description: 'Pixel-perfect, accessible interfaces that feel premium.' },
  { icon: Layers, title: 'Scalable Architecture', description: 'Built to grow from MVP to production-scale systems.' },
  { icon: ShieldCheck, title: 'Secure Backend', description: 'Best-practice security, auth, and data protection.' },
  { icon: MessagesSquare, title: 'Transparent Communication', description: 'Clear timelines, regular updates, no surprises.' },
  { icon: CalendarCheck, title: 'On-Time Delivery', description: 'Predictable milestones and dependable launches.' },
  { icon: Handshake, title: 'Long-Term Partnership', description: 'A technology partner that stays on after launch — not just a vendor.' },
];

export type Tech = { name: string; icon?: string; fallback?: LucideIcon };

const devicon = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

export const TECH_STACK: Tech[] = [
  { name: 'React', icon: devicon('react/react-original.svg') },
  { name: 'Node.js', icon: devicon('nodejs/nodejs-original.svg') },
  { name: 'MongoDB', icon: devicon('mongodb/mongodb-original.svg') },
  { name: 'Express', icon: devicon('express/express-original.svg') },
  { name: 'PHP', icon: devicon('php/php-original.svg') },
  { name: 'Laravel', icon: devicon('laravel/laravel-original.svg') },
  { name: 'Swift', icon: devicon('swift/swift-original.svg') },
  { name: 'Kotlin', icon: devicon('kotlin/kotlin-original.svg') },
  { name: 'Flutter', icon: devicon('flutter/flutter-original.svg') },
  { name: 'React Native', icon: devicon('react/react-original.svg') },
  { name: 'Python', icon: devicon('python/python-original.svg') },
  { name: 'Azure', icon: devicon('azure/azure-original.svg') },
  { name: 'OpenAI & LLMs', fallback: Bot },
];

export const CONTACT_SERVICES = [
  'Mobile App',
  'Web Application',
  'E-commerce',
  'SaaS',
  'CRM',
  'AI / LLM',
  'UI/UX',
  'Backend / API',
  'Custom Software',
  'Other',
];

export const BUDGETS = [
  'Under $1,000',
  '$1,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000+',
  'Not sure yet',
];

/** Grouped toolkit shown under the logo marquee. */
export const TECH_GROUPS: { group: string; items: string[] }[] = [
  { group: 'Mobile', items: ['Swift', 'SwiftUI', 'UIKit', 'Kotlin', 'Java', 'Flutter', 'React Native'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS'] },
  { group: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'PHP', 'Laravel', 'Java'] },
  { group: 'Databases', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'] },
  { group: 'Cloud & DevOps', items: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
  { group: 'AI & ML', items: ['LLMs', 'Fine-tuning', 'RAG', 'AI Agents', 'Vector DBs', 'Azure AI'] },
];

export type CaseStudy = {
  project: string;
  industry: string;
  challenge: string;
  solution: string;
  stack: string[];
  features: string[];
  outcome: string;
  url: string;
  linkLabel: 'View on App Store' | 'Visit website';
  hue: number;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    project: 'Breakdown CRM',
    industry: 'Business / CRM',
    challenge:
      'Replace scattered spreadsheets and manual lead handling with one system for sales, employees and permissions.',
    solution:
      'A business website connected to a custom CRM and admin panel with role-based access control and Excel lead import.',
    stack: ['Laravel', 'MySQL', 'Blade', 'RBAC'],
    features: ['Lead management', 'Website lead forms', 'Excel lead import', 'Employee management', 'Roles & permissions', 'Admin dashboard'],
    outcome: 'A single operational platform combining the public website with internal CRM workflows.',
    url: 'https://breakdown.laravue.in/',
    linkLabel: 'Visit website',
    hue: 220,
  },
  {
    project: 'Miles',
    industry: 'Travel / Rewards / Shopping',
    challenge:
      'Reward everyday travel and shopping activity inside a single consumer app without draining device resources.',
    solution:
      'A native iOS experience with efficient location handling, reward logic and partner offer integrations behind a clean API layer.',
    stack: ['Swift', 'iOS SDKs', 'REST APIs', 'Location services'],
    features: ['Reward tracking', 'Offers & shopping', 'Location-aware activity', 'Secure account flows'],
    outcome: 'Live on the App Store as a consumer travel and rewards application.',
    url: 'https://apps.apple.com/us/app/miles-travel-shop-get-cash/id1393913947',
    linkLabel: 'View on App Store',
    hue: 210,
  },
  {
    project: 'Abhinaya Creations',
    industry: 'E-commerce / Handicrafts',
    challenge: 'Take a regional handicrafts business online with full control over catalogue, orders and shipping.',
    solution:
      'An end-to-end e-commerce platform with payments, shipment management and a dynamic content-managed storefront.',
    stack: ['Laravel', 'MySQL', 'Payment gateway', 'Admin panel'],
    features: ['Product & category management', 'Orders', 'Payments', 'Shipment management', 'Dynamic content'],
    outcome: 'A live storefront where the team manages products, orders and shipping independently.',
    url: 'https://abhinayacreations.in/',
    linkLabel: 'Visit website',
    hue: 25,
  },
  {
    project: 'Fitburn',
    industry: 'Fitness / Health / Wearables',
    challenge: 'Deliver reliable workout and activity tracking across phone and wearable with data staying in sync.',
    solution: 'An iOS and watch-focused application with health data integration and synchronised activity sessions.',
    stack: ['Swift', 'SwiftUI', 'watchOS', 'HealthKit'],
    features: ['Workout tracking', 'Wearable companion', 'Health data sync', 'Progress views'],
    outcome: 'Available on the App Store as a fitness and wearable application.',
    url: 'https://apps.apple.com/us/app/fitburn-watch/id6502515644',
    linkLabel: 'View on App Store',
    hue: 12,
  },
  {
    project: 'Stored',
    industry: 'Social Commerce',
    challenge: 'Blend social interaction with product discovery so shopping feels like browsing a feed, not a catalogue.',
    solution:
      'A social shopping app with feed-driven discovery, product collections and a backend built for interaction-heavy usage.',
    stack: ['Swift', 'REST APIs', 'Cloud backend'],
    features: ['Social feed', 'Product collections', 'User profiles', 'Sharing & discovery'],
    outcome: 'Published on the App Store as a social shopping application.',
    url: 'https://apps.apple.com/in/app/stored-social-shopping/id1663518540',
    linkLabel: 'View on App Store',
    hue: 275,
  },
  {
    project: 'Glowing Fusions',
    industry: 'E-commerce / Jewellery & Gifting',
    challenge: 'Present jewellery and gifting products attractively on mobile while supporting custom gift creation.',
    solution:
      'A mobile-first e-commerce experience with a rich catalogue and custom gifting flow; a mobile app is in development.',
    stack: ['E-commerce stack', 'Responsive front-end', 'Payments'],
    features: ['Jewellery catalog', 'Gifting', 'Custom gift creation', 'Mobile-first experience'],
    outcome: 'A live commerce platform with a companion mobile application currently under development.',
    url: 'https://www.glowingfusions.com/',
    linkLabel: 'Visit website',
    hue: 290,
  },
];

export const SOLUTIONS: { title: string; description: string }[] = [
  { title: 'MVP Development', description: 'Turn an idea into a working product quickly.' },
  { title: 'SaaS Platforms', description: 'Scalable subscription-based products.' },
  { title: 'Mobile Applications', description: 'Native and cross-platform apps.' },
  { title: 'Enterprise Software', description: 'Custom software for complex business workflows.' },
  { title: 'E-commerce', description: 'Complete online commerce ecosystems.' },
  { title: 'AI Products', description: 'AI-powered apps and intelligent automation.' },
  { title: 'CRM', description: 'Custom business management systems.' },
  { title: 'Digital Transformation', description: 'Modernise existing systems and workflows.' },
];

export const INDUSTRIES = [
  'E-commerce',
  'Travel & Tourism',
  'Fitness & Wellness',
  'Healthcare',
  'FinTech',
  'Social Platforms',
  'SaaS',
  'Retail',
  'Education',
  'Hospitality',
  'Real Estate',
  'Entertainment',
  'Logistics',
];

export const EXPERTISE = ['Mobile', 'Web', 'Backend', 'Cloud', 'AI', 'UI/UX', 'E-commerce', 'SaaS', 'Business apps'];

/** Tiles of the AI & ML section. */
export const AI_CAPABILITIES = [
  {
    key: 'llm',
    title: 'LLM integration',
    description:
      'GPT, Claude, Azure OpenAI and open-source models wired into your web and mobile apps — chat, copilots, summarisation and structured extraction.',
    points: ['Chatbots & copilots', 'Structured extraction', 'Multi-provider'],
  },
  {
    key: 'training',
    title: 'Model training & fine-tuning',
    description:
      'Fine-tune open models on your own data, or train classic ML for forecasting, classification and recommendations — with evaluation sets so you can measure it.',
    points: ['Fine-tuning', 'Recommendation systems', 'Evaluation'],
  },
  {
    key: 'rag',
    title: 'RAG & document intelligence',
    description:
      'Answers grounded in your documents, with citations — chunking strategies, vector search and AI-powered search over your knowledge base.',
    points: ['Vector databases', 'AI-powered search', 'Citations'],
  },
  {
    key: 'agents',
    title: 'AI agents & automation',
    description:
      'Agents that plan, call your tools and APIs, verify results and complete workflows end to end — with a human in the loop where it matters.',
    points: ['Tool calling', 'Workflow automation', 'Human-in-the-loop'],
  },
  {
    key: 'cloud',
    title: 'Azure & cloud deployment',
    description:
      'Deployed on Azure — Azure OpenAI, AI Search, Azure ML — or on AWS. Your data stays in your tenant, with monitoring and cost control built in.',
    points: ['Azure OpenAI', 'Azure AI Search', 'AKS & Functions'],
  },
];

export const AI_USE_CASES = [
  'AI application development',
  'LLM integration',
  'AI chatbots',
  'RAG systems',
  'AI agents',
  'Document intelligence',
  'AI-powered search',
  'Recommendation systems',
  'Workflow automation',
];

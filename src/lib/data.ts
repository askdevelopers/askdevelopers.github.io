import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  CalendarCheck,
  Code2,
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
} from 'lucide-react';

export const CONTACT = {
  phone: '+91-8401009197',
  phoneHref: 'tel:+918401009197',
  email: 'askdevelopers001@gmail.com',
  facebook: 'https://www.facebook.com/ask.dev.58/',
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Why us', href: '#why' },
  { label: 'Contact', href: '#contact' },
];

export const STATS = [
  { value: '10+', label: 'Apps live on the App Store' },
  { value: '4+', label: 'Web platforms shipped' },
  { value: '12+', label: 'Technologies mastered' },
  { value: '100%', label: 'On-time delivery' },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
  /** Visual treatment of the card — mirrors the alternating cards in the design references. */
  tone?: 'default' | 'light' | 'featured';
};

export const SERVICES: Service[] = [
  {
    icon: Smartphone,
    title: 'iOS & Android App Development',
    description:
      'Native iOS (Swift) and Android (Kotlin) apps engineered for performance, security, and a polished user experience.',
    points: ['Native Swift & Kotlin', 'App Store & Play Store launch', 'Performance tuning'],
    tone: 'light',
  },
  {
    icon: Code2,
    title: 'MERN Stack Development',
    description:
      'Full-stack JavaScript apps with MongoDB, Express, React, and Node.js — fast, scalable, and maintainable.',
    points: ['React + Node.js', 'REST & GraphQL APIs', 'Realtime & sockets'],
  },
  {
    icon: Server,
    title: 'PHP & Laravel Development',
    description: 'Robust backend platforms and APIs with Laravel — secure, well-architected, and ready to scale.',
    points: ['Laravel & Lumen APIs', 'Queues & jobs', 'Database design'],
  },
  {
    icon: PenTool,
    title: 'UI/UX Design',
    description:
      'User-centered design that looks beautiful and converts — research, wireframes, prototypes, and design systems.',
    points: ['Figma prototypes', 'Design systems', 'Usability testing'],
  },
  {
    icon: Sparkles,
    title: 'AI & LLM Solutions',
    description:
      'Integrate GPT, Claude, and open-source LLMs into your product — chatbots, RAG, agents, and automation.',
    points: ['RAG & vector search', 'AI agents', 'LLM fine-tuning'],
    tone: 'featured',
  },
  {
    icon: Layers,
    title: 'Hybrid App Development',
    description: 'One codebase, every platform — Flutter and React Native apps that feel native on iOS and Android.',
    points: ['Flutter & React Native', 'Shared codebase', 'Fast iteration'],
  },
  {
    icon: LayoutDashboard,
    title: 'CRM & Admin Panel Development',
    description: 'Custom CRMs and admin dashboards with roles, permissions, and workflows tailored to your business.',
    points: ['RBAC & permissions', 'Custom workflows', 'Dashboards & reports'],
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Development',
    description: 'Conversion-focused online stores with payments, shipments, inventory, and a powerful admin panel.',
    points: ['Payments & shipments', 'Inventory & orders', 'SEO-ready'],
  },
];

export type AppItem = { name: string; url: string; tag: string; hue: number };

export const APPS: AppItem[] = [
  { name: 'Miles', url: 'https://apps.apple.com/us/app/miles-travel-shop-get-cash/id1393913947', tag: 'Travel', hue: 210 },
  { name: 'Fitburn', url: 'https://apps.apple.com/us/app/fitburn-watch/id6502515644', tag: 'Health & Fitness', hue: 12 },
  { name: 'Stored', url: 'https://apps.apple.com/in/app/stored-social-shopping/id1663518540', tag: 'Social Shopping', hue: 275 },
  { name: 'Flocco', url: 'https://apps.apple.com/in/app/flocco/id1629581523', tag: 'Fashion', hue: 165 },
  { name: 'Adawatie', url: 'https://apps.apple.com/in/app/adawatie/id1473815126', tag: 'Lifestyle', hue: 40 },
  { name: 'Soniq', url: 'https://apps.apple.com/in/app/soniq-your-music-companion/id6744140818', tag: 'Music', hue: 235 },
  { name: 'Meal ID', url: 'https://apps.apple.com/us/app/meal-id-meal-prep-planner/id1504099975', tag: 'Food & Drink', hue: 95 },
  { name: 'Palace', url: 'https://apps.apple.com/gb/app/palaceapp/id1439058382', tag: 'Lifestyle', hue: 300 },
  { name: 'LilRequester', url: 'https://apps.apple.com/us/app/lil-requester/id1488416772', tag: 'Productivity', hue: 190 },
  { name: 'Dynamite Travel', url: 'https://apps.apple.com/us/app/dynamite-travel-1-0/id998736815', tag: 'Travel', hue: 20 },
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
  { icon: Sparkles, title: 'Clean UI', description: 'Pixel-perfect, accessible interfaces that feel premium.' },
  { icon: Layers, title: 'Scalable Architecture', description: 'Built to grow from MVP to millions of users.' },
  { icon: ShieldCheck, title: 'Secure Backend', description: 'Best-practice security, auth, and data protection.' },
  { icon: MessagesSquare, title: 'Transparent Communication', description: 'Clear timelines, honest updates, no surprises.' },
  { icon: CalendarCheck, title: 'On-Time Delivery', description: 'Predictable milestones and dependable launches.' },
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
  { name: 'OpenAI & LLMs', fallback: Bot },
];

export const CONTACT_SERVICES = ['App Development', 'Web Development', 'UI/UX', 'AI/LLM', 'E-commerce', 'CRM', 'Other'];

export const BUDGETS = [
  'Under $1,000',
  '$1,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000+',
  'Not sure yet',
];

# Ask Developers — Website

Marketing site for Ask Developers (web, mobile & AI development agency).
Vite + React + TypeScript + Tailwind CSS, with an optional Supabase backend for the contact form.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run typecheck && npm run lint
```

## Design & motion

Apple-style layout: alternating charcoal / warm-cream sections (`.theme-dark` / `.theme-light` in
`src/index.css`), one large centred headline per section, a single orange accent, and tokens (`bg`, `fg`,
`muted`, `card`, `line`, `link`) that components use so the same markup works on both themes.
Type is Clash Display (headlines) + Satoshi (body) from Fontshare, with JetBrains Mono for small labels;
all three are linked in `index.html`.

- `framer-motion` drives everything scroll-linked: the hero parallax, the pinned Platform story
  (`Platform.tsx` + `PlatformVisuals.tsx`), the AI section tiles (`AI.tsx`), the Process timeline, tilt cards in Work, and the `Reveal`,
  `SplitWords` and `CountUp` helpers in `src/components/motion.tsx`.
- `lenis` provides smooth scrolling (`src/lib/smooth-scroll.ts`); it is skipped for users who prefer reduced
  motion, and `MotionConfig reducedMotion="user"` tones the rest down for them.
- `Robot.tsx` is the mascot (eyes follow the pointer); `ScrollBot.tsx` is the rail on the right where it rides
  along with the scroll position. Rail stops come from `PAGE_SECTIONS` in `src/lib/data.ts`.

## Content

All copy — services, portfolio, case studies, solutions, industries, process, tech stack — lives in
`src/lib/data.ts`. Sections are in `src/components/`, composed in `src/App.tsx`.

**Business identity** (phone, email, legal name, postal address, hours, dispute jurisdiction, the policies'
"last updated" date) lives in `src/lib/business.ts`. It feeds the footer, the About/Support/policy pages and the
Organization structured data on the home page, so change it there and nowhere else. The address and hours are
empty until filled in; nothing renders for them until then. Keep them identical to Google Business Profile,
Play Console and App Store Connect.

Content is merged from the two earlier versions of the site:
[AskBoltWebsite](https://github.com/askdevelopers001-crypto/AskBoltWebsite) and
logicflow-solutions (private; case studies, solutions, industries, tech groups, About copy).

`public/google7e92cbcc02c94970.html` is the Google Search Console verification file — keep it.

## Pages

Besides the home page the site has the pages that app stores, ad platforms, payment providers and directories
ask for. Each is a real HTML file in `dist/` with its full content prerendered, so the URL returns 200 and reads
without JavaScript:

| URL                | Used for                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `/about/`          | Company identity: Google Ads advertiser verification, Google Business Profile, store pages |
| `/support/`       | App Store "Support URL", Play Console support contact, `security.txt` policy link          |
| `/privacy/`        | Privacy policy URL for Play Console, App Store Connect, Google Ads, Facebook Login          |
| `/terms/`          | Terms & Conditions / EULA link, payment-provider onboarding                                |
| `/refund-policy/`  | Refund & cancellation policy for payment providers and Google Ads                          |
| `/delete-account/` | Play Console account-deletion URL, Facebook Login data-deletion URL                        |
| `/404.html`        | Served by GitHub Pages for unknown paths                                                   |

The build also writes `sitemap.xml`, `robots.txt` (with the sitemap line) and `.well-known/security.txt`.

How it works: `vite build` is a multi-page build (one entry per shell `<dir>/index.html` listed in
`src/pages/routes.ts`); `scripts/site-pages.ts` injects each page's title, description, canonical and social tags
and emits the sitemap/robots/security files; then `vite build --ssr` plus `scripts/prerender.mjs` render the React
page into each shell. Page components are in `src/pages/content/`, with the shared header/footer/article layout in
`src/pages/shell/`.

To add a page: add an entry to `PAGE_ROUTES` in `src/pages/routes.ts`, copy an existing `<dir>/index.html` shell
and change its `data-page`, add the component and register it in `src/pages/registry.tsx`. Footer links, the
sitemap and the head tags follow automatically.

## Contact form

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

- The form calls the `submit-contact` edge function (`supabase/functions/submit-contact`), which stores the
  lead and emails it via Resend when `RESEND_API_KEY` is set on the function.
- If the function isn't deployed it inserts straight into `contact_submissions`
  (`supabase/migrations/` — apply both migrations; the second adds the `company` column).
- Without Supabase env vars the form opens a pre-filled email instead.

## Deploy

Live at https://askdevelopers.github.io/ via GitHub Pages. `.github/workflows/deploy.yml` builds and deploys on
every push to `main`; the Pages source is "GitHub Actions" (Settings → Pages). Add `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` as repository secrets to enable the Supabase contact form in production.

For a custom domain, add it under Settings → Pages (GitHub provides HTTPS), point a CNAME at
`askdevelopers.github.io`, and set `VITE_SITE_URL` (e.g. `https://askdevelopers.com`) in `.github/workflows/deploy.yml`
or `vite.config.ts`. Every canonical URL, Open Graph tag, sitemap entry and structured-data URL follows from that one value.

Vercel also works: framework preset **Vite**, build `npm run build`, output `dist`, same env vars.

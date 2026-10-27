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
  (`Platform.tsx` + `PlatformVisuals.tsx`), the Process timeline, tilt cards in Work, and the `Reveal`,
  `SplitWords` and `CountUp` helpers in `src/components/motion.tsx`.
- `lenis` provides smooth scrolling (`src/lib/smooth-scroll.ts`); it is skipped for users who prefer reduced
  motion, and `MotionConfig reducedMotion="user"` tones the rest down for them.
- `Robot.tsx` is the mascot (eyes follow the pointer); `ScrollBot.tsx` is the rail on the right where it rides
  along with the scroll position. Rail stops come from `PAGE_SECTIONS` in `src/lib/data.ts`.

## Content

All copy — services, portfolio, case studies, solutions, industries, process, tech stack, contact details —
lives in `src/lib/data.ts`. Sections are in `src/components/`, composed in `src/App.tsx`.

Content is merged from the two earlier versions of the site:
[AskBoltWebsite](https://github.com/askdevelopers001-crypto/AskBoltWebsite) and
logicflow-solutions (private; case studies, solutions, industries, tech groups, About copy).

`public/google7e92cbcc02c94970.html` is the Google Search Console verification file — keep it.

## Contact form

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

- The form calls the `submit-contact` edge function (`supabase/functions/submit-contact`), which stores the
  lead and emails it via Resend when `RESEND_API_KEY` is set on the function.
- If the function isn't deployed it inserts straight into `contact_submissions`
  (`supabase/migrations/` — apply both migrations; the second adds the `company` column).
- Without Supabase env vars the form opens a pre-filled email instead.

## Deploy (Vercel)

Import the repo in Vercel — framework preset **Vite**, build `npm run build`, output `dist`.
Add the two `VITE_SUPABASE_*` env vars in the project settings.

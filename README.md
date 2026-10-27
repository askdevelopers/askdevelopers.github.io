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

## Content

All copy — services, portfolio, process, tech stack, contact details — lives in `src/lib/data.ts`.
Sections are in `src/components/`, composed in `src/App.tsx`.

## Contact form

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

- The form calls the `submit-contact` edge function (`supabase/functions/submit-contact`), which stores the
  lead and emails it via Resend when `RESEND_API_KEY` is set on the function.
- If the function isn't deployed it inserts straight into `contact_submissions`
  (`supabase/migrations/`).
- Without Supabase env vars the form opens a pre-filled email instead.

## Deploy (Vercel)

Import the repo in Vercel — framework preset **Vite**, build `npm run build`, output `dist`.
Add the two `VITE_SUPABASE_*` env vars in the project settings.

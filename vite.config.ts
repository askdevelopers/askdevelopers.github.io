import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { PAGE_ROUTES } from './src/pages/routes';
import { sitePages } from './scripts/site-pages';

// Public origin, used for canonical URLs, Open Graph tags, the sitemap and structured data. When the site
// moves to a custom domain, set VITE_SITE_URL in the deploy workflow (or here) and nothing else changes.
const SITE_URL = (process.env.VITE_SITE_URL || 'https://askdevelopers.github.io').replace(/\/$/, '');
process.env.VITE_SITE_URL = SITE_URL;

const root = fileURLToPath(new URL('./', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for the build; the Pages workflow sets VITE_BASE (currently "/").
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), sitePages(SITE_URL)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      // Multi-page build: the home page plus one real HTML file per page in src/pages/routes.ts.
      // (Ignored by the `--ssr` prerender build, which takes its single entry from the command line.)
      input: {
        main: `${root}index.html`,
        ...Object.fromEntries(PAGE_ROUTES.map((r) => [r.key, `${root}${r.file}`])),
      },
    },
  },
});

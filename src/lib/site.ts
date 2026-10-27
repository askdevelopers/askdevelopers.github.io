/** Public origin without a trailing slash. Set once in vite.config.ts (VITE_SITE_URL); override it when the domain changes. */
export const SITE_URL = String(import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');

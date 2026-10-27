/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public origin, set in vite.config.ts. */
  readonly VITE_SITE_URL: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

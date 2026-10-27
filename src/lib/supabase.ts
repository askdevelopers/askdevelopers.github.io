import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Null when the env vars are missing, so the site still renders and the form can fall back to email. */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

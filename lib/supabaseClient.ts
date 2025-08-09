// lib/supabaseClient.ts
'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/db';
import { env } from './env';

export const supabase = createBrowserClient<Database>(
  env.SUPABASE_URL!,
  env.SUPABASE_ANON_KEY!
);

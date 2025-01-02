import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '@/env.mjs';

export const createClient = () =>
  createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ); 
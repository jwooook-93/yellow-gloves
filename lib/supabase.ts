import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim() !== ''
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://dsmbgxuowznmmojuowhv.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim() !== ''
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'sb_publishable_RFGRplL8Y0OKZMZ3yr0d-A_2K-2j';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

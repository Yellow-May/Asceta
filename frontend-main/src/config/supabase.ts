import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please add the following to your .env file:');
  console.error('VITE_SUPABASE_URL=your-project-url.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
  console.warn('⚠️ Supabase URL format may be incorrect. Expected format: https://xxxxx.supabase.co');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});


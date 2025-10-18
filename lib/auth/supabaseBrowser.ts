// lib/supabaseBrowser.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // <-- QUAN TRỌNG: tự exchange code khi thấy ?code=... trên URL
      flowType: 'pkce',
    },
  }
)

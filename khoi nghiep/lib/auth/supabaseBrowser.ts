// lib/auth/supabaseBrowser.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,      // ✅ Giữ phiên sau khi login
        autoRefreshToken: true,    // ✅ Tự làm mới token khi hết hạn
      },
    }
  )

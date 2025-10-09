// lib/supabaseServer.ts (chạy ở server)
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  const cookieStore = await cookies()
  const baseCookieOptions = {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value ?? null
        },
        set(name, value, options) {
          try {
            cookieStore.set({
              ...baseCookieOptions,
              ...options,
              name,
              value,
            })
          } catch (error) {
            console.error('Failed to set Supabase auth cookie', error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({
              ...baseCookieOptions,
              ...options,
              name,
              value: '',
              maxAge: 0,
            })
          } catch (error) {
            console.error('Failed to remove Supabase auth cookie', error)
          }
        },
      },
    }
  )
}

// middleware.ts (new version using @supabase/ssr)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value ?? null
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // ✅ Bảo vệ các route yêu cầu đăng nhập
  if (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/payment')
  ) {
    if (!session) {
      const url = new URL('/supabase-login', req.url)
      const redirect = NextResponse.redirect(url)
      // propagate any auth cookies set during getSession back to the client
      res.cookies.getAll().forEach((c) => redirect.cookies.set(c))
      return redirect
    }
  }

  // ✅ Redirect người đã đăng nhập khỏi trang login
  if (req.nextUrl.pathname === '/supabase-login' && session) {
    const url = new URL('/', req.url)
    const redirect = NextResponse.redirect(url)
    res.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|supabase-login|login).*)',
  ],
}

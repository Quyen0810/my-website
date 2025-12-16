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
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  // Refresh session nếu có để đảm bảo session được cập nhật
  const { data: { user } } = await supabase.auth.getUser()
  const hasSession = !!user

  // ✅ TẮT CHỨC NĂNG BẮT BUỘC ĐĂNG NHẬP
  // Tất cả routes đều có thể truy cập mà không cần đăng nhập
  // Chỉ redirect người đã đăng nhập khỏi trang login về trang chủ (optional)
  
  // ✅ Redirect người đã đăng nhập khỏi trang login về trang đích hoặc trang chủ (tùy chọn)
  if ((req.nextUrl.pathname === '/supabase-login' || req.nextUrl.pathname === '/login') && hasSession) {
    const redirectUrl = req.nextUrl.searchParams.get('redirect') || '/'
    const url = new URL(redirectUrl, req.url)
    const redirect = NextResponse.redirect(url)
    // Copy cookies từ res sang redirect
    res.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie.name, cookie.value)
    })
    return redirect
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|supabase-login|login).*)',
  ],
}

// app/supabase-login/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { supabaseBrowser } from '@/lib/auth/supabaseBrowser' // ← đảm bảo đúng path export singleton

export default function SupabaseLoginPage() {
  const router = useRouter()
  const supabase = supabaseBrowser; // ✅ KHÔNG gọi như hàm
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Dọn URL nếu có ?code=&state= sau khi Supabase đã exchange code -> session
  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('code') || url.searchParams.has('state')) {
      url.searchParams.delete('code')
      url.searchParams.delete('state')
      window.history.replaceState({}, '', url.pathname + url.search)
    }
  }, [])

  // Kiểm tra session hiện tại; nếu đã đăng nhập thì chuyển về trang chủ
  const checkSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.replace('/')
    } catch (err) {
      console.error('Session check error:', err)
    }
  }, [router, supabase])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      if (data.user) router.replace('/')
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: name || '', phone: phone || '' } },
      })
      if (error) throw new Error(error.message)

      if (data.user) {
        if (data.user.email_confirmed_at) {
          setMessage('Đăng ký thành công! Đang chuyển hướng...')
          setTimeout(() => router.replace('/'), 1200)
        } else {
          setMessage('Vui lòng kiểm tra email để xác thực tài khoản')
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      // redirectTo quay thẳng về ORIGIN bạn đang chạy (http://localhost:3001)
      // hoặc NEXT_PUBLIC_SITE_URL nếu bạn muốn cố định.
      const origin =
        (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')) ||
        window.location.origin

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: origin, // ← KHÔNG /auth/callback tự viết
          // scopes: 'openid email profile', // tuỳ chọn
          // queryParams: { access_type: 'offline', prompt: 'consent' }, // tuỳ chọn
        },
      })
      if (error) throw new Error(error.message)
      // Không cần setLoading(false) — đang chuyển tab sang Google
    } catch (err: any) {
      setError(err?.message || 'Google đăng nhập thất bại')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card-elevated">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h1>
            <p className="text-slate-600">
              {isLogin ? 'Chào mừng bạn quay trở lại' : 'Tạo tài khoản mới'}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  required={!isLogin}
                  className="input-field"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="input-field"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
            {message && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Đăng nhập với Google"
                title="Đăng nhập với Google"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLogin ? 'Đăng nhập với Google' : 'Đăng ký với Google'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null) }}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Sử dụng Supabase Authentication</p>
          </div>
        </div>
      </div>
    </div>
  )
}

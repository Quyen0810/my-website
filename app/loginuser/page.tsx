'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'

import { supabaseBrowser } from '@/lib/auth/supabaseBrowser'

type AuthMode = 'login' | 'register'

type FormState = {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const initialFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

const googleIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function LoginUserPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [form, setForm] = useState<FormState>(initialFormState)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [verifyingSession, setVerifyingSession] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const isSubmitDisabled = useMemo(
    () => loading || verifyingSession || checkingSession,
    [loading, verifyingSession, checkingSession]
  )

  const handleFieldChange = useCallback((field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => {
      if (!prev[field]) return prev
      const { [field]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}

    if (!form.email.trim()) {
      errors.email = 'Vui lòng nhập email'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Email không hợp lệ'
    }

    if (!form.password) {
      errors.password = 'Vui lòng nhập mật khẩu'
    } else if (form.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (mode === 'register') {
      if (!form.name.trim()) {
        errors.name = 'Vui lòng nhập họ và tên'
      }

      if (!form.phone.trim()) {
        errors.phone = 'Vui lòng nhập số điện thoại'
      }

      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [form, mode])

  const verifyServerSession = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) {
        setVerifyingSession(true)
        setStatusMessage('Đang xác thực phiên Supabase...')
      }

      setSessionError(null)

      try {
        const response = await fetch('/api/auth/supabase-session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        if (response.status === 401) {
          return false
        }

        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.message || 'Không thể xác thực phiên Supabase.')
        }

        return true
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Không thể xác thực phiên Supabase.'
        setSessionError(message)
        return false
      } finally {
        if (!silent) {
          setVerifyingSession(false)
          setStatusMessage(null)
        }
      }
    },
    []
  )

  useEffect(() => {
    let isMounted = true

    const checkExistingSession = async () => {
      setCheckingSession(true)
      setSessionError(null)

      try {
        const supabase = supabaseBrowser()
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (session) {
          const verified = await verifyServerSession({ silent: true })
          if (verified && isMounted) {
            router.replace('/')
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Supabase session check failed:', error)
          setSessionError('Không thể kiểm tra phiên đăng nhập hiện tại. Vui lòng đăng nhập lại.')
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false)
        }
      }
    }

    checkExistingSession()

    const supabase = supabaseBrowser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted || !session) return
      const verified = await verifyServerSession({ silent: true })
      if (verified) {
        router.replace('/')
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router, verifyServerSession])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setAuthError(null)
      setStatusMessage(null)

      if (!validateForm()) {
        return
      }

      setLoading(true)

      try {
        const supabase = supabaseBrowser()

        if (mode === 'login') {
          const { error } = await supabase.auth.signInWithPassword({
            email: form.email.trim(),
            password: form.password,
          })

          if (error) {
            throw new Error(error.message)
          }

          const verified = await verifyServerSession()

          if (verified) {
            toast.success('Đăng nhập thành công!')
            router.replace('/')
          } else {
            toast.error('Không thể xác thực phiên Supabase. Vui lòng thử lại.')
          }
        } else {
          const { data, error } = await supabase.auth.signUp({
            email: form.email.trim(),
            password: form.password,
            options: {
              data: {
                name: form.name.trim(),
                phone: form.phone.trim(),
              },
            },
          })

          if (error) {
            throw new Error(error.message)
          }

          if (data.session) {
            const verified = await verifyServerSession()
            if (verified) {
              toast.success('Đăng ký và đăng nhập thành công!')
              router.replace('/')
              return
            }
          }

          setStatusMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
          setForm(initialFormState)
          toast.success('Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.')
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'
        setAuthError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [form, mode, router, validateForm, verifyServerSession]
  )

  const handlePasswordReset = useCallback(async () => {
    if (!form.email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: 'Vui lòng nhập email để đặt lại mật khẩu' }))
      return
    }

    setAuthError(null)
    setStatusMessage(null)

    try {
      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
        redirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/supabase-login?reset=true` : undefined,
      })

      if (error) {
        throw new Error(error.message)
      }

      setStatusMessage('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.')
      toast.success('Đã gửi email đặt lại mật khẩu.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.'
      setAuthError(message)
      toast.error(message)
    }
  }, [form.email])

  const handleOAuthLogin = useCallback(async () => {
    setAuthError(null)
    setStatusMessage(null)
    setSessionError(null)
    setOauthLoading('google')

    try {
      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Đang chuyển hướng để đăng nhập với Google...')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể đăng nhập bằng Google. Vui lòng thử lại.'
      setAuthError(message)
      toast.error(message)
    }
    setOauthLoading(null)
  }, [])

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'))
    setForm(initialFormState)
    setFieldErrors({})
    setAuthError(null)
    setStatusMessage(null)
    setSessionError(null)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl bg-white/5 p-6 shadow-2xl backdrop-blur lg:grid-cols-[1fr_430px]">
          <div className="relative hidden overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-10 flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-blue-100/80">
                <Sparkles className="h-5 w-5" />
                ViLaw Identity
              </div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Bảo mật vững chắc cho mọi phiên đăng nhập
              </h1>
              <p className="mt-4 max-w-md text-blue-100/90">
                Đăng nhập nhanh chóng, an toàn với Supabase Authentication. Hỗ trợ email, đăng ký mới và đăng nhập với Google chỉ trong vài bước.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4">
                <ShieldCheck className="h-10 w-10 flex-shrink-0 text-white" />
                <div>
                  <p className="font-semibold">Phiên đăng nhập được bảo vệ</p>
                  <p className="text-sm text-blue-100/80">
                    Kiểm tra Supabase session tự động giúp đảm bảo bạn luôn được xác thực an toàn.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-blue-100/90">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                    1
                  </span>
                  Đăng nhập bằng email hoặc đăng ký tài khoản mới.
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                    2
                  </span>
                  Hoặc sử dụng Google để xác thực trong một chạm.
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                    3
                  </span>
                  Hệ thống tự động xác minh Supabase session và chuyển hướng.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">{mode === 'login' ? 'Chào mừng quay trở lại' : 'Tạo tài khoản mới'}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  {mode === 'login' ? 'Đăng nhập vào ViLaw' : 'Đăng ký tài khoản Supabase'}
                </h2>
              </div>
              <button
                type="button"
                onClick={toggleMode}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
              >
                {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {checkingSession && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang kiểm tra phiên Supabase...
                </div>
              )}

              {statusMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {statusMessage}
                </div>
              )}

              {authError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {authError}
                </div>
              )}

              {sessionError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {sessionError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {mode === 'register' && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      className={`w-full rounded-xl border px-10 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        fieldErrors.name ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={event => handleFieldChange('name', event.target.value)}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full rounded-xl border px-10 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      fieldErrors.email ? 'border-red-400' : 'border-slate-200'
                    }`}
                    placeholder="ban@example.com"
                    value={form.email}
                    onChange={event => handleFieldChange('email', event.target.value)}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {mode === 'register' && (
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className={`w-full rounded-xl border px-10 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        fieldErrors.phone ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="0912345678"
                      value={form.phone}
                      onChange={event => handleFieldChange('phone', event.target.value)}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className={`w-full rounded-xl border px-10 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      fieldErrors.password ? 'border-red-400' : 'border-slate-200'
                    }`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={event => handleFieldChange('password', event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              {mode === 'register' && (
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`w-full rounded-xl border px-10 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        fieldErrors.confirmPassword ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword}
                      onChange={event => handleFieldChange('confirmPassword', event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiển thị mật khẩu xác nhận'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    disabled={isSubmitDisabled}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(loading || verifyingSession) && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-slate-200" />
                <span className="mx-4 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">Hoặc</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleOAuthLogin}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={Boolean(oauthLoading) || isSubmitDisabled}
              >
                {oauthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : googleIcon}
                {mode === 'login' ? 'Đăng nhập với Google' : 'Đăng ký bằng Google'}
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Bằng việc tiếp tục, bạn đồng ý với các điều khoản sử dụng và chính sách bảo mật của ViLaw.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

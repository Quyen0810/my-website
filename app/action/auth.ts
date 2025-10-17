'use server'

import { z } from 'zod'
import { createClient } from '@/lib/auth/supabaseSever'

const SignUpSchema = z.object({
  full_name: z.string().min(2, 'Vui lòng nhập họ tên.').max(120),
  email: z.string().email('Email không hợp lệ.').max(254),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự.')
    .max(128, 'Mật khẩu quá dài.'),
})

function mapSupabaseError(msg: string) {
  const m = msg.toLowerCase()
  if (m.includes('rate limit')) return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.'
  if (m.includes('user already registered') || m.includes('already exists'))
    return 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng quên mật khẩu.'
  if (m.includes('email address is invalid')) return 'Email không hợp lệ.'
  if (m.includes('password')) return 'Mật khẩu chưa đạt yêu cầu chính sách.'
  if (m.includes('smtp')) return 'Máy chủ email đang gặp sự cố. Hãy thử “Đăng ký với Google” hoặc thử lại sau.'
  return msg
}

export type SignUpResult =
  | { ok: true; needsEmailConfirm: boolean; message: string }
  | { ok: false; message: string }

export async function signUpAction(formData: FormData): Promise<SignUpResult> {
  try {
    const values = {
      full_name: String(formData.get('full_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      password: String(formData.get('password') ?? ''),
    }

    const parsed = SignUpSchema.safeParse(values)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Dữ liệu không hợp lệ.'
      return { ok: false, message: firstError }
    }

    const supabase = await createClient()

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof process !== 'undefined' ? '' : '') // fallback
    const emailRedirectTo =
      siteUrl && siteUrl.length > 0
        ? `${siteUrl.replace(/\/$/, '')}/auth/callback`
        : undefined

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo,
        data: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone || undefined,
        },
      },
    })

    if (error) {
      return { ok: false, message: mapSupabaseError(error.message) }
    }

    // Nếu đã bật "Confirm email", Supabase sẽ không tạo session ngay
    const needsEmailConfirm = !data.session
    return {
      ok: true,
      needsEmailConfirm,
      message: needsEmailConfirm
        ? 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác minh.'
        : 'Đăng ký thành công.',
    }
  } catch (e: any) {
    const message =
      typeof e?.message === 'string' && e.message.trim()
        ? e.message
        : 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
    return { ok: false, message }
  }
}

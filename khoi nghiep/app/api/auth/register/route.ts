import { NextRequest, NextResponse } from 'next/server'
import { createUser, sanitizeUser } from '@/lib/auth/userStore'
import { createSession, SESSION_MAX_AGE } from '@/lib/auth/sessionStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined

    if (!name) {
      return NextResponse.json({ message: 'Họ và tên là bắt buộc' }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ message: 'Email là bắt buộc' }, { status: 400 })
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const user = createUser({ name, email, password, phone })
    const session = createSession(user.id)

    const response = NextResponse.json({ user: sanitizeUser(user) })
    response.cookies.set({
      name: 'vilaw_session',
      value: session.id,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_MAX_AGE,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    const message = error instanceof Error ? error.message : 'Không thể đăng ký. Vui lòng thử lại.'
    return NextResponse.json({ message }, { status: message === 'Tài khoản đã tồn tại' ? 409 : 500 })
  }
}
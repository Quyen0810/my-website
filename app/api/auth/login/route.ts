import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, sanitizeUser } from '@/lib/auth/userStore'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, SESSION_MAX_AGE } from '@/lib/auth/sessionStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json({ message: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }

    const user = findUserByEmail(email)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
    }

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
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Không thể đăng nhập. Vui lòng thử lại.' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, sanitizeUser } from '@/lib/auth/userStore'
import { createSession, SESSION_MAX_AGE } from '@/lib/auth/sessionStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const provider = body.provider

    if (provider !== 'google') {
      return NextResponse.json({ message: 'Provider không được hỗ trợ' }, { status: 400 })
    }

    // For demo purposes, we'll create a Google user with a demo email
    // In production, you would verify the Google OAuth token here
    const demoGoogleUser = {
      name: 'Google User',
      email: 'google.user@example.com',
      password: 'google123', // This would be handled differently in production
      phone: '0900000000'
    }

    // Check if user already exists
    let user = findUserByEmail(demoGoogleUser.email)
    
    if (!user) {
      // Create new user for Google login
      user = createUser(demoGoogleUser)
    }

    // Create session
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
    console.error('Google OAuth error:', error)
    return NextResponse.json({ message: 'Không thể đăng nhập với Google. Vui lòng thử lại.' }, { status: 500 })
  }
}

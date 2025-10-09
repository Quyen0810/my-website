import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession, getSession, touchSession } from '@/lib/auth/sessionStore'
import { getUserById, sanitizeUser } from '@/lib/auth/userStore'

export async function GET() {
  const sessionCookie = cookies().get('vilaw_session')
  const session = getSession(sessionCookie?.value)

  if (!session) {
    if (sessionCookie) {
      cookies().set('vilaw_session', '', { path: '/', maxAge: 0 })
    }
    return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })
  }

  const user = getUserById(session.userId)
  if (!user) {
    deleteSession(session.id)
    cookies().set('vilaw_session', '', { path: '/', maxAge: 0 })
    return NextResponse.json({ message: 'Phiên không hợp lệ' }, { status: 401 })
  }

  touchSession(session.id)
  return NextResponse.json({ user: sanitizeUser(user) })
}
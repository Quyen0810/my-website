import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession } from '@/lib/auth/sessionStore'

export async function POST() {
  const sessionCookie = cookies().get('vilaw_session')
  if (sessionCookie?.value) {
    deleteSession(sessionCookie.value)
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({ name: 'vilaw_session', value: '', maxAge: 0, path: '/' })
  return response
}
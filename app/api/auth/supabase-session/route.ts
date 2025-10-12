import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabaseSever'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Supabase session lookup error:', error)
      return NextResponse.json(
        { message: 'Không thể lấy thông tin phiên Supabase', details: error.message },
        { status: 500 }
      )
    }

    if (!session) {
      return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })
    }

    return NextResponse.json({
      user: session.user,
      expiresAt: session.expires_at,
    })
  } catch (error) {
    console.error('Supabase session error:', error)
    return NextResponse.json({ message: 'Không thể xác thực phiên' }, { status: 500 })
  }
}

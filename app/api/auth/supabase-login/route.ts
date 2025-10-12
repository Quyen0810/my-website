import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabaseSever'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 401 })
    }

    return NextResponse.json({ 
      user: data.user,
      session: data.session 
    })
  } catch (error) {
    console.error('Supabase login error:', error)
    return NextResponse.json({ message: 'Không thể đăng nhập. Vui lòng thử lại.' }, { status: 500 })
  }
}

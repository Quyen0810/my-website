import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabaseSever'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
          phone: phone || '',
        }
      }
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      user: data.user,
      session: data.session 
    })
  } catch (error) {
    console.error('Supabase register error:', error)
    return NextResponse.json({ message: 'Không thể đăng ký. Vui lòng thử lại.' }, { status: 500 })
  }
}

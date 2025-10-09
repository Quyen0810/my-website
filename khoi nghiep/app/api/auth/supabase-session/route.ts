import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabaseSever'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Supabase session error:', error)
    return NextResponse.json({ message: 'Không thể xác thực phiên' }, { status: 500 })
  }
}

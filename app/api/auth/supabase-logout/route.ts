import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabaseSever'

export async function POST() {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Supabase logout error:', error)
    return NextResponse.json({ message: 'Không thể đăng xuất' }, { status: 500 })
  }
}

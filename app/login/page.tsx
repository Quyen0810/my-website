'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Supabase login page
    router.replace('/supabase-login')
  }, [router])

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Đang chuyển hướng đến trang đăng nhập...</p>
      </div>
    </div>
  )
}

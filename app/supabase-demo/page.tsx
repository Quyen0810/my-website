'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { LogOut, User, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function SupabaseDemoPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chưa đăng nhập</h1>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để tiếp tục</p>
          <Link
            href="/supabase-login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Supabase Authentication Demo</h1>
            <button
              onClick={signOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Thông tin người dùng</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-800">Tên:</p>
                    <p className="font-medium text-blue-900">{user.user_metadata?.name || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-800">Email:</p>
                    <p className="font-medium text-blue-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-800">Ngày tạo:</p>
                    <p className="font-medium text-blue-900">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Trạng thái xác thực</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-800">Email đã xác thực:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.email_confirmed_at ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-800">Trạng thái:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-800">ID người dùng:</span>
                  <span className="text-xs font-mono text-green-700 break-all">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Cấu hình Supabase</h3>
            <p className="text-yellow-800 mb-4">
              Để sử dụng Supabase Authentication, bạn cần:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-yellow-800">
              <li>Tạo tài khoản Supabase tại <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Tạo project mới trong Supabase</li>
              <li>Lấy URL và Anon Key từ Settings → API</li>
              <li>Tạo file <code className="bg-yellow-100 px-1 rounded">.env.local</code> với các biến môi trường</li>
              <li>Bật Authentication providers trong Supabase Dashboard</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

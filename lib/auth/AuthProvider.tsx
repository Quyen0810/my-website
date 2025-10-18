// lib/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabaseBrowser } from './supabaseBrowser' // ⬅️ export const supabaseBrowser = createClient(...)

interface AuthContextType {
  user: User | null
  loading: boolean
  loginToken: string | null
  signOut: () => Promise<void>
  refreshLoginToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const TOKEN_STORAGE_KEY = 'eswap.loginToken'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loginToken, setLoginToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ dùng singleton client thay vì gọi như hàm
  const supabase = supabaseBrowser

  const persistToken = useCallback((token: string | null) => {
    setLoginToken(token)
    if (typeof window === 'undefined') return
    if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    else window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }, [])

  const createLoginToken = useCallback(
    async (currentUser: User) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            email: currentUser.email ?? undefined,
          }),
        })

        if (!response.ok) throw new Error(`Failed to create login token: ${response.status}`)

        const data = (await response.json()) as { token?: string }
        if (!data.token || typeof data.token !== 'string') {
          throw new Error('Invalid login token response')
        }
        persistToken(data.token)
      } catch (error) {
        console.error('Failed to create login token:', error)
        persistToken(null)
      }
    },
    [persistToken]
  )

  const handleUserStateChange = useCallback(
    async (currentUser: User | null) => {
      setUser(currentUser)
      if (currentUser) await createLoginToken(currentUser)
      else persistToken(null)
    },
    [createLoginToken, persistToken]
  )

  // Khôi phục token đã lưu (nếu có)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (storedToken) setLoginToken(storedToken)
  }, [])

  // Lấy session lần đầu + lắng nghe thay đổi auth
  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        // detectSessionInUrl=true sẽ tự exchange code=>session khi có ?code ở URL
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        await handleUserStateChange(session?.user ?? null)
      } catch (error) {
        console.error('Failed to get initial session:', error)
        if (!mounted) return
        setUser(null)
        persistToken(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleUserStateChange(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [handleUserStateChange, persistToken, supabase])

  // (Tuỳ chọn) Sau khi exchange thành công, xoá ?code=&state= khỏi URL cho sạch
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (url.searchParams.has('code') || url.searchParams.has('state')) {
      url.searchParams.delete('code')
      url.searchParams.delete('state')
      window.history.replaceState({}, '', url.pathname + url.search)
    }
  }, [user])

  // Đảm bảo có loginToken sau OAuth redirect
  useEffect(() => {
    const ensureLoginToken = async () => {
      if (user && !loginToken) await createLoginToken(user)
    }
    void ensureLoginToken()
  }, [user, loginToken, createLoginToken])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      persistToken(null)
      setUser(null)
    } catch (error) {
      console.error('Failed to sign out:', error)
      throw error
    }
  }

  const refreshLoginToken = useCallback(async () => {
    if (!user) {
      persistToken(null)
      return
    }
    await createLoginToken(user)
  }, [createLoginToken, persistToken, user])

  return (
    <AuthContext.Provider value={{ user, loading, loginToken, signOut, refreshLoginToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

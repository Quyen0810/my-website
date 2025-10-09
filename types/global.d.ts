// Global type declarations for ViLaw
import { SessionRecord } from '@/lib/auth/sessionStore'
import { StoredUser } from '@/lib/auth/userStore'

import type { SessionRecord } from '@/lib/auth/sessionStore'
import type { StoredUser } from '@/lib/auth/userStore'

declare global {
  interface Window {
    apiService: any
    RATE_LIMITS: any
    ERROR_CONFIG: any
  }

  var __VILAW_SESSION_STORE: Map<string, SessionRecord> | undefined
  var __VILAW_USER_STORE: Map<string, StoredUser> | undefined
}

export {}

// Allow importing image assets
declare module '*.jpg' {
  const content: import('next/image').StaticImageData
  export default content
}

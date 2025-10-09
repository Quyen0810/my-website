import { randomBytes } from 'crypto'

export type SessionRecord = {
  id: string
  userId: string
  createdAt: number
  expiresAt: number
}

type GlobalWithSessionStore = typeof globalThis & {
  __VILAW_SESSION_STORE?: Map<string, SessionRecord>
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
export const SESSION_MAX_AGE = Math.floor(SESSION_TTL_MS / 1000)

const globalWithStore = globalThis as GlobalWithSessionStore

if (!globalWithStore.__VILAW_SESSION_STORE) {
  globalWithStore.__VILAW_SESSION_STORE = new Map<string, SessionRecord>()
}

const sessionStore = globalWithStore.__VILAW_SESSION_STORE

export function createSession(userId: string): SessionRecord {
  const id = randomBytes(24).toString('hex')
  const record: SessionRecord = {
    id,
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS
  }

  sessionStore.set(id, record)
  return record
}

export function getSession(sessionId?: string | null): SessionRecord | null {
  if (!sessionId) {
    return null
  }

  const record = sessionStore.get(sessionId) || null
  if (!record) {
    return null
  }

  if (record.expiresAt < Date.now()) {
    sessionStore.delete(sessionId)
    return null
  }

  return record
}

export function deleteSession(sessionId?: string | null) {
  if (!sessionId) {
    return
  }

  sessionStore.delete(sessionId)
}

export function touchSession(sessionId: string) {
  const record = sessionStore.get(sessionId)
  if (!record) {
    return
  }

  record.expiresAt = Date.now() + SESSION_TTL_MS
  sessionStore.set(sessionId, record)
}

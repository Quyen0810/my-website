export interface Session {
  id: string
  userId: string
  createdAt: Date
  expiresAt: Date
}

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// In-memory session store (replace with database in production)
const sessions: Session[] = []

export function createSession(userId: string): Session {
  const id = generateSessionId()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE)

  const session: Session = {
    id,
    userId,
    createdAt: now,
    expiresAt
  }

  sessions.push(session)
  return session
}

export function findSession(sessionId: string): Session | null {
  const session = sessions.find(s => s.id === sessionId)
  
  if (!session) {
    return null
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    deleteSession(sessionId)
    return null
  }

  return session
}

// Alias for compatibility
export const getSession = findSession

export function touchSession(sessionId: string): boolean {
  const session = findSession(sessionId)
  if (session) {
    // Update expiresAt to extend session
    session.expiresAt = new Date(Date.now() + SESSION_MAX_AGE)
    return true
  }
  return false
}

export function deleteSession(sessionId: string): boolean {
  const index = sessions.findIndex(s => s.id === sessionId)
  if (index !== -1) {
    sessions.splice(index, 1)
    return true
  }
  return false
}

export function deleteUserSessions(userId: string): void {
  const userSessions = sessions.filter(s => s.userId === userId)
  userSessions.forEach(session => deleteSession(session.id))
}

// Clean up expired sessions periodically
export function cleanupExpiredSessions(): void {
  const now = new Date()
  sessions.forEach(session => {
    if (session.expiresAt < now) {
      deleteSession(session.id)
    }
  })
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000)

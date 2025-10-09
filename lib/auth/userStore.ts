import { randomUUID } from 'crypto'
import { hashPassword } from '@/lib/auth/password'

export type UserLevel = 'normal' | 'pro' | 'admin'

export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  level: UserLevel
  phone?: string
  createdAt: string
}

type GlobalWithUserStore = typeof globalThis & {
  __VILAW_USER_STORE?: Map<string, StoredUser>
}

const globalWithStore = globalThis as GlobalWithUserStore

if (!globalWithStore.__VILAW_USER_STORE) {
  globalWithStore.__VILAW_USER_STORE = new Map<string, StoredUser>()
}

const userStore = globalWithStore.__VILAW_USER_STORE

if (userStore.size === 0) {
  const seedUsers: Array<Omit<StoredUser, 'id' | 'passwordHash' | 'createdAt'> & { password: string }> = [
    {
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      password: 'user123',
      level: 'normal',
      phone: '0912345678'
    },
    {
      name: 'Trần Thị B',
      email: 'pro@example.com',
      password: 'pro123',
      level: 'pro',
      phone: '0987654321'
    },
    {
      name: 'Admin ViLaw',
      email: 'admin@vilaw.com',
      password: 'admin123',
      level: 'admin',
      phone: '0909090909'
    }
  ]

  seedUsers.forEach(user => {
    const id = randomUUID()
    userStore.set(id, {
      id,
      name: user.name,
      email: user.email.toLowerCase(),
      passwordHash: hashPassword(user.password),
      level: user.level,
      phone: user.phone,
      createdAt: new Date().toISOString()
    })
  })
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.toLowerCase()
  for (const [id, user] of userStore) {
    if (user.email === normalized) {
      return user
    }
  }
}

export function findUserById(id: string): StoredUser | undefined {
  return userStore.get(id)
}

// Alias for compatibility
export const getUserById = findUserById

export function createUser({ name, email, password, phone }: {
  name: string
  email: string
  password: string
  phone?: string
}): StoredUser {
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('Tài khoản đã tồn tại')
  }

  const id = randomUUID()
  const user: StoredUser = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    level: 'normal',
    phone,
    createdAt: new Date().toISOString()
  }

  userStore.set(id, user)
  return user
}

export function sanitizeUser(user: StoredUser): Omit<StoredUser, 'passwordHash'> {
  const { passwordHash, ...sanitized } = user
  return sanitized
}
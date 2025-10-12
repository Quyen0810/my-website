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
    },
    {
      name: 'Google User',
      email: 'google.user@example.com',
      password: 'google123',
      level: 'normal',
      phone: '0900000000'
    },
    {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      level: 'normal',
      phone: '0911111111'
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
  for (const user of Array.from(userStore.values())) {
    if (user.email === normalized) {
      return user
    }
  }
  return undefined
}

export function getUserById(id: string): StoredUser | undefined {
  return userStore.get(id)
}

interface CreateUserInput {
  name: string
  email: string
  password: string
  phone?: string
  level?: UserLevel
}

export function createUser(input: CreateUserInput): StoredUser {
  const email = input.email.toLowerCase()
  if (findUserByEmail(email)) {
    throw new Error('Tài khoản đã tồn tại')
  }

  const id = randomUUID()
  const user: StoredUser = {
    id,
    name: input.name,
    email,
    passwordHash: hashPassword(input.password),
    level: input.level ?? 'normal',
    phone: input.phone,
    createdAt: new Date().toISOString()
  }

  userStore.set(id, user)
  return user
}

export function sanitizeUser(user: StoredUser): Omit<StoredUser, 'passwordHash'> {
  const { passwordHash, ...rest } = user
  return rest
}

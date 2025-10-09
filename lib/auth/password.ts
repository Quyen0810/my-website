import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const KEY_LENGTH = 64

export function hashPassword(password: string): string {
  if (!password) {
    throw new Error('Password is required to generate a hash')
  }

  const salt = randomBytes(16).toString('hex')
  const derivedKey = scryptSync(password, salt, KEY_LENGTH)
  return `${salt}:${derivedKey.toString('hex')}`
}

export function verifyPassword(password: string, hashedValue: string): boolean {
  if (!password || !hashedValue) {
    return false
  }

  const [salt, key] = hashedValue.split(':')
  if (!salt || !key) {
    return false
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH)
  const keyBuffer = Buffer.from(key, 'hex')

  if (keyBuffer.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(derivedKey, keyBuffer)
}
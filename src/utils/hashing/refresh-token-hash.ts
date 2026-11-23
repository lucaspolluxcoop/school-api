import { hash } from 'crypto'

export const refreshTokenHash = (token: string) => {
  return hash('SHA-256', token)
}

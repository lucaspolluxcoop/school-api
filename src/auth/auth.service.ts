import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { verifyPassword } from '../utils/hashing/argon2id'
import { InvalidPasswordFormatError } from '../utils/errors/invalid-password-format-error'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'
import { AuthRepository } from './auth.repository'
import { refreshTokenHash } from '../utils/hashing/refresh-token-hash'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly repository: AuthRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.getLoginUserByEmail(email)

    if (!user) {
      return null
    }

    // manejo de argon2 para comparar contraseñas
    try {
      const verifiedPassword = await verifyPassword(user.password, password)
      if (!verifiedPassword) {
        return null
      }

      // generar jwt token y devolver si coinciden
      const accessToken = await this.jwtService.signAsync({ sub: user.id })

      // generar refresh token y guardarlo en db
      const refreshToken = randomBytes(64).toString('hex')
      const hashedToken = refreshTokenHash(refreshToken)
      await this.repository.createSession(user.id, hashedToken)

      // devuelvo accessToken y refreshToken
      return { accessToken, refreshToken, user }
    } catch (e) {
      if (e instanceof InvalidPasswordFormatError) {
        throw new Error(
          `The registered password for user: ${user.id} is corrupted`,
        )
      }

      throw e
    }
  }

  async logout(token: string) {
    const hashedToken = refreshTokenHash(token)

    const response = await this.repository.revokeSession(hashedToken)

    return response.length >= 1
  }

  async refresh(token: string) {
    const hashedToken = refreshTokenHash(token)

    const userId = await this.repository.getUserIdBySession(hashedToken)

    if (!userId) return undefined

    const accessToken = await this.jwtService.signAsync({ sub: userId })

    return { accessToken }
  }
}

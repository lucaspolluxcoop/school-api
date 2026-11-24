import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Res,
  SignedCookies,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { type Response } from 'express'
import {
  REFRESH_DURATION,
  REFRESH_TOKEN,
  REFRESH_TOKEN_PATH,
} from '../utils/constants/jwt'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/login')
  async login(
    @Body() { email, password }: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.service.login(email, password)

    if (!response) {
      throw new UnauthorizedException()
    }

    res.cookie(REFRESH_TOKEN, String(response.refreshToken), {
      signed: true,
      httpOnly: true,
      secure: this.configService.getOrThrow<boolean>('COOKIE_SECURE'),
      sameSite: 'lax',
      maxAge: REFRESH_DURATION,
      path: REFRESH_TOKEN_PATH,
    })

    return { token: response.accessToken }
  }

  @HttpCode(204)
  @Post('/logout')
  async logout(
    @SignedCookies(REFRESH_TOKEN) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) {
      res.clearCookie(REFRESH_TOKEN, {
        path: REFRESH_TOKEN_PATH,
      })
      throw new BadRequestException()
    }
    const response = await this.service.logout(token)

    res.clearCookie(REFRESH_TOKEN, {
      path: REFRESH_TOKEN_PATH,
    })

    if (!response) {
      throw new ForbiddenException()
    }

    return null
  }
}

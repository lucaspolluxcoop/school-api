import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { type Response } from 'express'
import { REFRESH_DURATION } from '../utils/constants/jwt'
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

    res.cookie('refreshToken', String(response.refreshToken), {
      signed: true,
      httpOnly: true,
      secure: this.configService.getOrThrow<boolean>('COOKIE_SECURE'),
      sameSite: 'lax',
      maxAge: REFRESH_DURATION,
      path: '/auth',
    })

    return { token: response.accessToken }
  }
}

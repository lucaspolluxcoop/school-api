import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SignedCookies,
  UnauthorizedException,
  UseGuards,
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
import { AuthGuard } from '../guards/auth.guard'
import { UsersService } from '../users/users.service'
import { type RequestWithUser } from '../types/request'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/login')
  async login(
    @Body() { email, password }: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(email, password)

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
    const response = await this.authService.logout(token)

    res.clearCookie(REFRESH_TOKEN, {
      path: REFRESH_TOKEN_PATH,
    })

    if (!response) {
      throw new ForbiddenException()
    }

    return null
  }

  @Post('/refresh')
  async refresh(
    @SignedCookies(REFRESH_TOKEN) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) {
      res.clearCookie(REFRESH_TOKEN, {
        path: REFRESH_TOKEN_PATH,
      })
      throw new BadRequestException()
    }

    const response = await this.authService.refresh(token)

    if (!response) {
      res.clearCookie(REFRESH_TOKEN, {
        path: REFRESH_TOKEN_PATH,
      })
      throw new UnauthorizedException()
    }

    return { token: response.accessToken }
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.getUser(request.userId)

    if (!user) {
      res.clearCookie(REFRESH_TOKEN, {
        path: REFRESH_TOKEN_PATH,
      })
      throw new UnauthorizedException()
    }

    return user
  }
}

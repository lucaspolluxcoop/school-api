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

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async login(
    @Body() { email, password }: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.service.login(email, password)

    if (!response) {
      throw new UnauthorizedException()
    }

    res.cookie('uid', String(response.user.id), {
      signed: true,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60,
    })

    return { token: response.accessToken }
  }
}

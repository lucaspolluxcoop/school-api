import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RequestWithUser } from '../types/request'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as RequestWithUser

    const bearerToken = request.headers.authorization

    if (!bearerToken || !bearerToken.startsWith('Bearer '))
      throw new UnauthorizedException()

    const token = bearerToken.split(' ')[1]

    try {
      const decode = await this.jwtService.verifyAsync(token)

      request.userId = decode.sub

      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}

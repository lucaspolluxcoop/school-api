import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getLoginUserByEmail(email: string) {
    const lcEmail = email.toLowerCase()
    return await this.repository.getLoginUserByEmail(lcEmail)
  }
}

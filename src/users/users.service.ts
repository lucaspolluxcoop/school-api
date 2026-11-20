import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getUserByEmail(email: string) {
    return await this.repository.getUserByEmail(email)
  }
}

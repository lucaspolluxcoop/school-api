import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { argonHashing } from '../utils/hashing/argon2id'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getLoginUserByEmail(email: string) {
    const lcEmail = email.toLowerCase()
    return await this.repository.getLoginUserByEmail(lcEmail)
  }

  async getUserByEmail(email: string) {
    const lcEmail = email.toLowerCase()
    return await this.repository.getUserByEmail(lcEmail)
  }

  async getUser(id: string) {
    return await this.repository.getUser(id)
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await argonHashing(password)
    const lcEmail = email.toLowerCase()

    return await this.repository.createUser(lcEmail, hashedPassword)
  }
}

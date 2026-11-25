import { Inject, Injectable } from '@nestjs/common'
import { DATABASE_CONN } from '../utils/constants/database'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { users } from '../schema/public'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE_CONN) private readonly db: NodePgDatabase) {}

  async getLoginUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.is_active, true)))

    return user
  }

  async getUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))

    return user
  }

  async getUser(id: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, id))

    return user
  }

  async createUser(email: string, hashedPassword: string) {
    return await this.db.insert(users).values({
      email,
      password: hashedPassword,
    })
  }
}

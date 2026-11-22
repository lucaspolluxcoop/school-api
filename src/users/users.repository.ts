import { Inject, Injectable } from '@nestjs/common'
import { DATABASE_CONN } from '../utils/constants/database'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { users } from '../schema/public'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE_CONN) private readonly db: NodePgDatabase) {}

  async getLoginUserByEmail(email: string) {
    const currentUsers = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.is_active, true)))

    return currentUsers.length === 1 ? currentUsers[0] : undefined
  }
}

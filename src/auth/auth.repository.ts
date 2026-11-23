import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_CONN } from '../utils/constants/database'
import { Inject } from '@nestjs/common'
import { sessions } from '../schema/public'
import { sumDate } from '../utils/dates/dates'
import { REFRESH_DURATION, REFRESH_DURATION_UNIT } from '../utils/constants/jwt'

export class AuthRepository {
  constructor(@Inject(DATABASE_CONN) private readonly db: NodePgDatabase) {}

  async createSession(userId: string, hashedToken: string) {
    await this.db.insert(sessions).values({
      token_hash: hashedToken,
      user_id: userId,
      expires_at: sumDate(new Date(), REFRESH_DURATION, REFRESH_DURATION_UNIT),
    })
  }
}

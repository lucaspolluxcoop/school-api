import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_CONN } from '../utils/constants/database'
import { Inject } from '@nestjs/common'
import { sessions, users } from '../schema/public'
import { sumDate } from '../utils/dates/dates'
import { REFRESH_DURATION, REFRESH_DURATION_UNIT } from '../utils/constants/jwt'
import { and, eq, gt, isNull } from 'drizzle-orm'

export class AuthRepository {
  constructor(@Inject(DATABASE_CONN) private readonly db: NodePgDatabase) {}

  async createSession(userId: string, hashedToken: string) {
    await this.db.insert(sessions).values({
      token_hash: hashedToken,
      user_id: userId,
      expires_at: sumDate(new Date(), REFRESH_DURATION, REFRESH_DURATION_UNIT),
    })
  }

  async revokeSession(token: string) {
    return await this.db
      .update(sessions)
      .set({
        revoked_at: new Date(),
      })
      .where(and(eq(sessions.token_hash, token), isNull(sessions.revoked_at)))
      .returning()
  }

  async getUserIdBySession(token: string) {
    const result = await this.db
      .select({ user_id: sessions.user_id })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.user_id))
      .where(
        and(
          eq(sessions.token_hash, token),
          isNull(sessions.revoked_at),
          gt(sessions.expires_at, new Date()),
          eq(users.is_active, true),
        ),
      )
      .limit(1)

    return result.length === 1 ? result[0].user_id : undefined
  }
}

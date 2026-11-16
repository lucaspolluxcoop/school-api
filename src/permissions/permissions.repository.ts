import { Inject, Injectable } from '@nestjs/common'
import { DATABASE_CONN } from '../utils/constants/database'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { permissions } from '../schema/public'

@Injectable()
export class PermissionsRepository {
  constructor(@Inject(DATABASE_CONN) private readonly db: NodePgDatabase) {}

  async getAll() {
    return await this.db.select().from(permissions)
  }
}

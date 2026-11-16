import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import { DATABASE_CONN } from '../utils/constants/database'
import { type PostgresDbType } from './database.factory'

@Injectable()
export class DatabaseHandler implements OnModuleDestroy {
  constructor(@Inject(DATABASE_CONN) private readonly db: PostgresDbType) {}

  async onModuleDestroy() {
    await this.db.$client.end()
  }
}

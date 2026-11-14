import { Module } from '@nestjs/common';
import { databaseFactory } from './database.factory';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONN } from '../utils/constants/database';

const connectionProvider = {
  provide: DATABASE_CONN,
  useFactory: databaseFactory,
  inject: [ConfigService],
};

@Module({
  providers: [connectionProvider],
  exports: [connectionProvider],
})
export class DatabaseModule {}

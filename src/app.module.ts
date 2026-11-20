import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { validateEnvVariables } from './config/env.validation'
import { CustomExceptionFilter } from './utils/errors/custom-exception.filter'
import { APP_FILTER } from '@nestjs/core'
import { PermissionsModule } from './permissions/permissions.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
      validate: validateEnvVariables,
    }),
    DatabaseModule,
    PermissionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}

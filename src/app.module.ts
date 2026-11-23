import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { validateEnvVariables } from './config/env.validation'
import { CustomExceptionFilter } from './utils/errors/custom-exception.filter'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { PermissionsModule } from './permissions/permissions.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import cookieParser from 'cookie-parser'

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(this.configService.getOrThrow<string>('COOKIE_SECRET')),
      )
      .forRoutes('*')
  }
}

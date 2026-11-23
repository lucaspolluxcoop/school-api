import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { ConfigService } from '@nestjs/config'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { UsersService } from '../users/users.service'

class AdminCredentials {
  @IsEmail()
  SEED_ADMIN_EMAIL: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  SEED_ADMIN_PASSWORD: string
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const configService = app.get(ConfigService)
  const plainObject = {
    SEED_ADMIN_EMAIL: configService.getOrThrow<string>('SEED_ADMIN_EMAIL'),
    SEED_ADMIN_PASSWORD: configService.getOrThrow<string>(
      'SEED_ADMIN_PASSWORD',
    ),
  }

  const validatedConfig = plainToInstance(AdminCredentials, plainObject)
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  const service = app.get(UsersService)
  const user = await service.getUserByEmail(validatedConfig.SEED_ADMIN_EMAIL)
  if (user) {
    await app.close()
  } else {
    await service.createUser(
      validatedConfig.SEED_ADMIN_EMAIL,
      validatedConfig.SEED_ADMIN_PASSWORD,
    )
    await app.close()
  }
}
void bootstrap()

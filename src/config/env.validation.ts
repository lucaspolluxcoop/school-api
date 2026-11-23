import { plainToInstance } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator'

class EnvironmentVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string

  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  JWT_SECRET: string

  @IsString()
  @IsNotEmpty()
  @MinLength(16)
  COOKIE_SECRET: string
}

export const validateEnvVariables = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}

import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const databaseFactory = (config: ConfigService) => {
  const pool = new Pool({
    connectionString: config.getOrThrow<string>('DATABASE_URL'),
  });
  const db = drizzle({ client: pool });

  return db;
};

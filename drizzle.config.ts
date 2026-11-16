import { defineConfig } from 'drizzle-kit'
import { loadEnvFile } from 'process'

try {
  loadEnvFile(`./.env.${process.env.NODE_ENV ?? 'development'}.local`)
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
    throw new Error('error reading ENV file', { cause: error })
  }
}

if (!process.env.DATABASE_URL)
  throw new Error('DATABASE_URL is not defined on the environment')

export default defineConfig({
  dialect: 'postgresql',
  schema: "./src/schema/*",
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})

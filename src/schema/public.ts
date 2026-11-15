import { timestamp } from 'drizzle-orm/pg-core'
import { uuid, pgTable, varchar } from 'drizzle-orm/pg-core'

export const permissions = pgTable('permissions', {
  id: uuid().defaultRandom().primaryKey(),
  code: varchar({ length: 50 }).unique().notNull(),
  description: varchar({ length: 256 }),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

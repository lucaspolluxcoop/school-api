import { boolean } from 'drizzle-orm/pg-core'
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
export const schools = pgTable('schools', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 256 }).unique().notNull(),
  password: varchar({ length: 256 }).notNull(),
  is_active: boolean().default(true).notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

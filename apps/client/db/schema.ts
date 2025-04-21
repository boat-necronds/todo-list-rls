import { sql } from "drizzle-orm"
import { crudPolicy } from "./drizzle-orm-neon"
import {
  pgTable,
  text,
  jsonb,
  timestamp,
  uuid,
  bigint,
  boolean,
} from "drizzle-orm/pg-core"
import { authenticatedRole, anonymousRole } from "drizzle-orm/neon"

// This is a multi-tenant app.
export const tenants = pgTable(
  "tenants",
  {
    id: uuid().primaryKey(),
    name: text(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.session()->>'tenant_id' = ${table.id}::text)`,
      modify: sql`(select auth.session()->>'tenant_id' = ${table.id}::text)`,
    }),
  ]
)

export const users = pgTable(
  "users",
  {
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id),
    id: uuid().primaryKey(),
    name: text(),
    email: text(),
    settings: jsonb(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.user_id() = ${table.id}::text)`,
      modify: sql`(select auth.user_id() = ${table.id}::text)`,
    }),
  ]
)

export const todos = pgTable(
  "todos",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
    insertedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: sql`
          (
            auth.user_id() = ${table.userId}::text
            OR auth.session()->>'role' = 'admin'::text
          )
        `,
      modify: sql`
          (
            auth.user_id() = ${table.userId}::text
            OR auth.session()->>'role' = 'admin'::text
          )
        `,
    }),
  ]
)

export const posts = pgTable(
  "posts",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    post: text().notNull(),
    insertedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    crudPolicy({
      role: anonymousRole,
      read: true,
      modify: false,
    }),
    crudPolicy({
      role: authenticatedRole,
      read: sql`
            (
              auth.user_id() = ${table.userId}::text
              OR auth.session()->>'role' = 'admin'::text
              OR auth.session()->>'role' = 'admin-post'::text
            )
          `,
      modify: sql`
            (
              auth.user_id() = ${table.userId}::text
              OR auth.session()->>'role' = 'admin'::text
              OR auth.session()->>'role' = 'admin-post'::text
            )
          `,
    }),
  ]
)

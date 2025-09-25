import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const sourceEnum = pgEnum("source", ["webhook", "client"]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  cartId: text("cart_id").notNull(),
  shop: varchar("shop").notNull(),
  name: text("name").notNull(),
  source: sourceEnum("source").notNull().default("webhook"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
  meta: jsonb("meta"),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

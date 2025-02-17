import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const periodDates = sqliteTable("period_dates", {
  id: integer("id").primaryKey(),
  date: text("date").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type PeriodDate = typeof periodDates.$inferSelect;
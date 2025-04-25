import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { periodDates, healthLogs, settings } from './schema';
import { eq } from 'drizzle-orm';

const MIGRATION_TABLES = `
CREATE TABLE IF NOT EXISTS period_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  icon_color TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

export const expo = SQLite.openDatabaseSync('period.db');

// Execute the migration
expo.execSync(MIGRATION_TABLES);

export const db = drizzle(expo);

// Helper function to get a setting
export async function getSetting(key: string): Promise<string | null> {
  const result = await db.select().from(settings).where(eq(settings.key, key));
  return result.length > 0 ? result[0].value : null;
}

// Helper function to set a setting
export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { periodDates, healthLogs } from './schema';

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
`;

export const expo = SQLite.openDatabaseSync('period.db');

// Execute the migration
expo.execSync(MIGRATION_TABLES);

export const db = drizzle(expo);
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { periodDates } from './schema';

const MIGRATION_TABLES = `
CREATE TABLE IF NOT EXISTS period_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

export const expo = SQLite.openDatabaseSync('period.db');

// Execute the migration
expo.execSync(MIGRATION_TABLES);

export const db = drizzle(expo);
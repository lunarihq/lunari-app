import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { settings } from './schema';
import { eq } from 'drizzle-orm';
import { initializeEncryption, getEncryptionKeyHex } from '../services/databaseEncryptionService';

const MIGRATION_TABLES = `
CREATE TABLE IF NOT EXISTS period_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_period_dates_date ON period_dates(date);

CREATE TABLE IF NOT EXISTS health_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

let expo: SQLite.SQLiteDatabase | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export async function deleteDatabaseFile(): Promise<void> {
  if (expo) {
    await expo.closeAsync();
  }
  
  expo = null;
  db = null;
  
  await SQLite.deleteDatabaseAsync('period.db');
}

export async function initializeDatabase(): Promise<void> {
  if (db) {
    return;
  }

  try {
    await initializeEncryption();
    
    const hexKey = getEncryptionKeyHex();
    
    expo = await SQLite.openDatabaseAsync('period.db');

    await expo.execAsync(`PRAGMA key = "x'${hexKey}'";`);
    await expo.execAsync('PRAGMA cipher_page_size = 4096;');
    await expo.execAsync('PRAGMA kdf_iter = 256000;');

    // Test DB access
    await expo.getAllAsync('SELECT count(*) FROM sqlite_master;');
    await expo.execAsync(MIGRATION_TABLES);
    
    db = drizzle(expo);
  } catch (error) {
    if (expo) {
      try {
        await expo.closeAsync();
      } catch (closeError) {
        console.error('[Database] Error closing database:', closeError);
      }
      expo = null;
    }
    db = null;
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export async function getSetting(key: string): Promise<string | null> {
  const database = getDB();
  const result = await database.select().from(settings).where(eq(settings.key, key));
  return result.length > 0 ? result[0].value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = getDB();
  await database
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function clearDatabaseCache(): Promise<void> {
  db = null;
  
  if (expo) {
    await expo.closeAsync();
    expo = null;
  }
}

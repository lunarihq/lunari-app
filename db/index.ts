import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { settings } from './schema';
import { eq } from 'drizzle-orm';
import { initializeEncryption, getEncryptionKey } from '../services/databaseEncryptionService';

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
let initializationPromise: Promise<void> | null = null;

export async function deleteDatabaseFile(): Promise<void> {
  try {
    if (expo) {
      await expo.closeAsync();
      expo = null;
    }
    db = null;
    
    await SQLite.deleteDatabaseAsync('period.db');
  } catch (error) {
    console.error('Error deleting database file:', error);
  }
}

export async function initializeDatabase(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      await initializeEncryption();
      
      const key = getEncryptionKey();
      const hexKey = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('');
      
      expo = await SQLite.openDatabaseAsync('period.db');
      
      await expo.execAsync(`PRAGMA key = "x'${hexKey}'";`);
      await expo.execAsync('PRAGMA cipher_page_size = 4096;');
      await expo.execAsync('PRAGMA kdf_iter = 256000;');
      
      await expo.execAsync(MIGRATION_TABLES);
      
      db = drizzle(expo);
    } catch (error) {
      initializationPromise = null;
      expo = null;
      db = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

// Helper function to get a setting
export async function getSetting(key: string): Promise<string | null> {
  if (!db) {
    await initializeDatabase();
  }
  const database = getDB();
  const result = await database.select().from(settings).where(eq(settings.key, key));
  return result.length > 0 ? result[0].value : null;
}

// Helper function to set a setting
export async function setSetting(key: string, value: string): Promise<void> {
  if (!db) {
    await initializeDatabase();
  }
  const database = getDB();
  await database
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export function clearDatabaseCache(): void {
  initializationPromise = null;
  db = null;
  if (expo) {
    expo.closeAsync().catch(() => {});
    expo = null;
  }
}

export { db };

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
    const pendingInit = initializationPromise;
    if (pendingInit) {
      try {
        await pendingInit;
      } catch {
        // Initialization failed or in-progress, proceed with deletion
      }
    }
    
    initializationPromise = null;
    
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
  console.log('[Database] initializeDatabase called', {
    hasInitPromise: !!initializationPromise,
    hasExpo: !!expo,
    hasDb: !!db,
    timestamp: new Date().toISOString(),
  });

  if (initializationPromise) {
    console.log('[Database] Initialization already in progress, waiting...');
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('[Database] Starting database initialization');
      
      console.log('[Database] Calling initializeEncryption...');
      await initializeEncryption();
      console.log('[Database] Encryption initialized');
      
      console.log('[Database] Getting encryption key...');
      const key = getEncryptionKey();
      const hexKey = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('');
      console.log('[Database] Encryption key obtained');
      
      console.log('[Database] Opening SQLite database...');
      expo = await SQLite.openDatabaseAsync('period.db');
      
      let isLegacyDatabase = false;
      try {
        console.log('[Database] Testing if database is encrypted...');
        await expo.execAsync(`PRAGMA key = "x'${hexKey}'";`);
        await expo.execAsync('PRAGMA cipher_page_size = 4096;');
        await expo.execAsync('PRAGMA kdf_iter = 256000;');
        
        await expo.getAllAsync('SELECT count(*) FROM sqlite_master;');
        console.log('[Database] Database is already encrypted');
      } catch (error: any) {
        console.log('[Database] Failed to open with encryption key, checking for legacy database:', error?.message);
        
        await expo.closeAsync();
        expo = await SQLite.openDatabaseAsync('period.db');
        
        try {
          await expo.getAllAsync('SELECT count(*) FROM sqlite_master;');
          console.log('[Database] Detected legacy unencrypted database');
          isLegacyDatabase = true;
        } catch (plaintextError) {
          console.error('[Database] Database is corrupted or encrypted with unknown key:', plaintextError);
          throw new Error('Database is corrupted or encrypted with unknown key');
        }
      }
      
      if (isLegacyDatabase) {
        console.log('[Database] Migrating legacy database to encrypted format...');
        try {
          await expo.execAsync(`PRAGMA rekey = "x'${hexKey}'";`);
          await expo.execAsync('PRAGMA cipher_page_size = 4096;');
          await expo.execAsync('PRAGMA kdf_iter = 256000;');
          console.log('[Database] Legacy database successfully encrypted');
          
          await expo.getAllAsync('SELECT count(*) FROM sqlite_master;');
          console.log('[Database] Encryption verified');
        } catch (rekeyError) {
          console.error('[Database] Failed to encrypt legacy database:', rekeyError);
          throw new Error('Failed to migrate database to encrypted format');
        }
      }
      
      console.log('[Database] Running migrations...');
      await expo.execAsync(MIGRATION_TABLES);
      console.log('[Database] Migrations completed');
      
      db = drizzle(expo);
      console.log('[Database] Database initialization completed successfully');
    } catch (error) {
      console.log('[Database] Database initialization failed:', error);
      if (expo) {
        try {
          console.log('[Database] Closing database connection after failure...');
          await expo.closeAsync();
        } catch (closeError) {
          console.error('[Database] Error closing database during initialization failure:', closeError);
        }
        expo = null;
      }
      initializationPromise = null;
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

export async function clearDatabaseCache(): Promise<void> {
  console.log('[Database] clearDatabaseCache called', {
    hasInitPromise: !!initializationPromise,
    hasExpo: !!expo,
    hasDb: !!db,
  });

  const pendingInit = initializationPromise;
  if (pendingInit) {
    try {
      console.log('[Database] Waiting for pending initialization before clearing...');
      await pendingInit;
    } catch {
      console.log('[Database] Pending initialization failed, proceeding with cleanup');
    }
  }

  console.log('[Database] Clearing database cache...');
  initializationPromise = null;
  db = null;
  
  if (expo) {
    console.log('[Database] Closing database connection...');
    await expo.closeAsync();
    expo = null;
    console.log('[Database] Database connection closed');
  }
  
  console.log('[Database] Database cache cleared');
}

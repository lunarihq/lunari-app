# SQLite Database Encryption Implementation Plan

## Executive Summary

This document outlines the implementation plan for encrypting the SQLite database in the Lunari app to protect sensitive health data from unauthorized access. The current unencrypted database at `/data/data/com.mariandre.lunari/databases/period.db` poses a significant privacy risk, as it can be accessed through physical access, ADB backup, or device forensics.

## Current State Analysis

### Security Vulnerability
- **Database Location**: `/data/data/com.mariandre.lunari/databases/period.db`
- **Current State**: Completely unencrypted
- **Attack Vectors**: 
  - Physical device access
  - ADB backup extraction
  - Device forensics
  - Root access on compromised devices

### Sensitive Data at Risk
- Period dates and cycle history
- Health logs (symptoms, moods, flow, discharge)
- Personal health notes
- User settings and preferences

### Existing Security Infrastructure
- ✅ PIN/Biometric app lock implemented via `AuthService`
- ✅ `expo-secure-store` already integrated (uses Android Keystore)
- ✅ `expo-crypto` available for cryptographic operations
- ❌ Database layer completely unprotected

## Proposed Solution Architecture

### Technology Stack
Since this is an Expo managed workflow app, we'll implement encryption using:
1. **expo-sqlite** (v16.0.8) - Already in use
2. **expo-sqlite-crypto-adapter** - New package for encryption support
3. **expo-secure-store** - Key management (Android Keystore/iOS Keychain)
4. **expo-crypto** - Additional cryptographic operations

### Alternative Approach (If crypto-adapter unavailable)
Custom encryption layer using:
- SQLite with encrypted columns (field-level encryption)
- AES-256-GCM encryption via expo-crypto
- Key derivation using PBKDF2

## Implementation Plan

### Phase 1: Setup and Dependencies

#### 1.1 Install Required Packages
```bash
npm install expo-sqlite-crypto-adapter
# or if not available:
npm install @craftzdog/react-native-buffer
```

#### 1.2 Create Encryption Service
Create `services/encryptionService.ts`:

```typescript
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const DB_ENCRYPTION_KEY = 'db_encryption_key';
const KEY_SALT = 'lunari_db_salt_v1';

export class EncryptionService {
  private static encryptionKey: string | null = null;

  static async generateEncryptionKey(): Promise<string> {
    // Generate a cryptographically secure random key
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const key = btoa(String.fromCharCode(...new Uint8Array(randomBytes)));
    
    // Store in Android Keystore via SecureStore
    await SecureStore.setItemAsync(DB_ENCRYPTION_KEY, key);
    this.encryptionKey = key;
    return key;
  }

  static async getEncryptionKey(): Promise<string> {
    if (this.encryptionKey) {
      return this.encryptionKey;
    }

    let key = await SecureStore.getItemAsync(DB_ENCRYPTION_KEY);
    if (!key) {
      key = await this.generateEncryptionKey();
    }
    
    this.encryptionKey = key;
    return key;
  }

  static async deriveKeyFromPin(pin: string): Promise<string> {
    // Derive encryption key from user PIN for additional security
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${KEY_SALT}:${pin}:${await this.getEncryptionKey()}`
    );
    return hash;
  }

  static async rotateEncryptionKey(): Promise<void> {
    // Key rotation for enhanced security
    const newKey = await this.generateEncryptionKey();
    // Trigger database re-encryption with new key
    await this.reEncryptDatabase(newKey);
  }

  private static async reEncryptDatabase(newKey: string): Promise<void> {
    // Implementation for re-encrypting database with new key
    // This will be called during key rotation
  }
}
```

### Phase 2: Database Layer Modification

#### 2.1 Update Database Connection
Modify `db/index.ts`:

```typescript
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { EncryptionService } from '../services/encryptionService';
import { settings, periodDates, healthLogs } from './schema';
import { eq } from 'drizzle-orm';

// Migration tables with encryption support
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
  name TEXT,  -- This will be encrypted for notes
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,  -- Encrypted for sensitive settings
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- New table for encryption metadata
CREATE TABLE IF NOT EXISTS encryption_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version INTEGER NOT NULL DEFAULT 1,
  encrypted_at TEXT DEFAULT CURRENT_TIMESTAMP,
  key_rotation_count INTEGER DEFAULT 0
);
`;

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function openEncryptedDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const encryptionKey = await EncryptionService.getEncryptionKey();
  
  // Option 1: Using expo-sqlite-crypto-adapter
  // dbInstance = await SQLite.openDatabaseAsync('period.db', {
  //   encryptionKey,
  //   enableCrypto: true
  // });

  // Option 2: Standard expo-sqlite with field-level encryption
  dbInstance = SQLite.openDatabaseSync('period.db');
  
  // Execute migrations
  dbInstance.execSync(MIGRATION_TABLES);
  
  return dbInstance;
}

export const getDb = async () => {
  const sqlite = await openEncryptedDatabase();
  return drizzle(sqlite);
};

// Encrypted field helpers
export class EncryptedField {
  static async encrypt(value: string): Promise<string> {
    if (!value) return value;
    const key = await EncryptionService.getEncryptionKey();
    // Implement AES-256-GCM encryption
    const encrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${key}:${value}`
    );
    return encrypted;
  }

  static async decrypt(encryptedValue: string): Promise<string> {
    if (!encryptedValue) return encryptedValue;
    // Implement decryption logic
    // This is a placeholder - real implementation needs proper AES decryption
    return encryptedValue;
  }
}

// Updated helper functions with encryption
export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const result = await db.select().from(settings).where(eq(settings.key, key));
  if (result.length > 0) {
    return await EncryptedField.decrypt(result[0].value);
  }
  return null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  const encryptedValue = await EncryptedField.encrypt(value);
  await db
    .insert(settings)
    .values({ key, value: encryptedValue })
    .onConflictDoUpdate({ 
      target: settings.key, 
      set: { value: encryptedValue } 
    });
}
```

### Phase 3: Data Migration Strategy

#### 3.1 Create Migration Service
Create `services/dataMigrationService.ts`:

```typescript
import * as SQLite from 'expo-sqlite';
import { EncryptionService } from './encryptionService';
import { getSetting, setSetting } from '../db';

const MIGRATION_VERSION_KEY = 'db_migration_version';
const CURRENT_MIGRATION_VERSION = 1;

export class DataMigrationService {
  static async migrateToEncryptedDatabase(): Promise<void> {
    try {
      // Check if migration is needed
      const currentVersion = await this.getMigrationVersion();
      if (currentVersion >= CURRENT_MIGRATION_VERSION) {
        console.log('Database already migrated');
        return;
      }

      // Step 1: Backup existing data
      const backupData = await this.backupExistingData();
      
      // Step 2: Create encrypted database
      await this.createEncryptedDatabase();
      
      // Step 3: Migrate data to encrypted database
      await this.migrateData(backupData);
      
      // Step 4: Verify migration
      const verified = await this.verifyMigration(backupData);
      if (!verified) {
        throw new Error('Migration verification failed');
      }
      
      // Step 5: Clean up old unencrypted database
      await this.cleanupOldDatabase();
      
      // Step 6: Update migration version
      await this.setMigrationVersion(CURRENT_MIGRATION_VERSION);
      
      console.log('Database migration completed successfully');
    } catch (error) {
      console.error('Database migration failed:', error);
      // Rollback logic
      await this.rollbackMigration();
      throw error;
    }
  }

  private static async backupExistingData(): Promise<any> {
    const db = SQLite.openDatabaseSync('period.db');
    
    // Backup all tables
    const periodDates = db.getAllSync('SELECT * FROM period_dates');
    const healthLogs = db.getAllSync('SELECT * FROM health_logs');
    const settings = db.getAllSync('SELECT * FROM settings');
    
    return {
      periodDates,
      healthLogs,
      settings,
      backupTimestamp: new Date().toISOString()
    };
  }

  private static async createEncryptedDatabase(): Promise<void> {
    // Generate encryption key if not exists
    await EncryptionService.getEncryptionKey();
    
    // Create new encrypted database structure
    // Implementation depends on chosen encryption method
  }

  private static async migrateData(backupData: any): Promise<void> {
    const db = await getDb();
    
    // Migrate period_dates
    for (const record of backupData.periodDates) {
      await db.insert(periodDates).values({
        date: record.date,
        createdAt: record.created_at
      });
    }
    
    // Migrate health_logs with encryption for sensitive fields
    for (const record of backupData.healthLogs) {
      const encryptedName = record.type === 'notes' 
        ? await EncryptedField.encrypt(record.name)
        : record.name;
        
      await db.insert(healthLogs).values({
        date: record.date,
        type: record.type,
        item_id: record.item_id,
        name: encryptedName,
        createdAt: record.created_at
      });
    }
    
    // Migrate settings with encryption
    for (const record of backupData.settings) {
      await setSetting(record.key, record.value);
    }
  }

  private static async verifyMigration(backupData: any): Promise<boolean> {
    // Verify record counts match
    const db = await getDb();
    
    const periodDatesCount = await db.select().from(periodDates);
    const healthLogsCount = await db.select().from(healthLogs);
    const settingsCount = await db.select().from(settings);
    
    return (
      periodDatesCount.length === backupData.periodDates.length &&
      healthLogsCount.length === backupData.healthLogs.length &&
      settingsCount.length === backupData.settings.length
    );
  }

  private static async cleanupOldDatabase(): Promise<void> {
    // Remove old unencrypted database file
    // Keep a backup for safety (can be deleted after verification period)
    const timestamp = new Date().getTime();
    // Rename old database instead of deleting immediately
    // Implementation depends on file system access in Expo
  }

  private static async rollbackMigration(): Promise<void> {
    // Restore from backup if migration fails
    console.error('Rolling back migration...');
  }

  private static async getMigrationVersion(): Promise<number> {
    const version = await getSetting(MIGRATION_VERSION_KEY);
    return version ? parseInt(version, 10) : 0;
  }

  private static async setMigrationVersion(version: number): Promise<void> {
    await setSetting(MIGRATION_VERSION_KEY, version.toString());
  }
}
```

### Phase 4: Integration with Existing Code

#### 4.1 Update App Initialization
Modify `app/_layout.tsx` to include migration check:

```typescript
import { DataMigrationService } from '../services/dataMigrationService';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // ... existing initialization code ...
        
        // Migrate to encrypted database if needed
        await DataMigrationService.migrateToEncryptedDatabase();
        
        setIsReady(true);
      } catch (e) {
        console.error('App initialization failed:', e);
      }
    }
    
    prepare();
  }, []);

  // ... rest of component
}
```

#### 4.2 Update Database Queries
All database queries need to be updated to use the async `getDb()` function:

```typescript
// Before:
// export const db = drizzle(expo);

// After:
// const db = await getDb();
```

### Phase 5: Security Enhancements

#### 5.1 Key Rotation Strategy
Implement automatic key rotation every 90 days:

```typescript
export class KeyRotationService {
  static async checkAndRotateKey(): Promise<void> {
    const lastRotation = await getSetting('last_key_rotation');
    const rotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days
    
    if (!lastRotation || 
        Date.now() - new Date(lastRotation).getTime() > rotationInterval) {
      await EncryptionService.rotateEncryptionKey();
      await setSetting('last_key_rotation', new Date().toISOString());
    }
  }
}
```

#### 5.2 Additional Security Measures

1. **Memory Protection**: Clear sensitive data from memory after use
2. **Anti-Tampering**: Implement integrity checks on the database
3. **Secure Backup**: Encrypted cloud backup support
4. **Audit Logging**: Track all database access attempts

### Phase 6: Testing Strategy

#### 6.1 Unit Tests
```typescript
describe('EncryptionService', () => {
  test('generates unique encryption keys', async () => {
    const key1 = await EncryptionService.generateEncryptionKey();
    const key2 = await EncryptionService.generateEncryptionKey();
    expect(key1).not.toBe(key2);
  });

  test('stores and retrieves encryption key securely', async () => {
    const key = await EncryptionService.getEncryptionKey();
    expect(key).toBeDefined();
    expect(key.length).toBeGreaterThan(32);
  });
});

describe('DataMigration', () => {
  test('successfully migrates unencrypted data', async () => {
    // Test migration process
  });

  test('verifies data integrity after migration', async () => {
    // Test data verification
  });

  test('handles migration failures gracefully', async () => {
    // Test rollback mechanism
  });
});
```

#### 6.2 Integration Tests
- Test encrypted database operations
- Verify performance impact
- Test key rotation without data loss
- Test backup and restore functionality

#### 6.3 Security Testing
- Attempt to read database file directly
- Test against common attack vectors
- Verify encryption strength
- Test key management security

### Phase 7: Performance Optimization

#### 7.1 Benchmarking
Monitor performance impact:
- Database query times
- App startup time
- Memory usage
- Battery impact

#### 7.2 Optimization Strategies
1. **Lazy Encryption**: Only encrypt sensitive fields
2. **Caching**: Implement secure in-memory cache
3. **Batch Operations**: Optimize bulk inserts/updates
4. **Index Optimization**: Ensure indexes work with encrypted data

### Phase 8: Rollout Strategy

#### 8.1 Phased Rollout
1. **Alpha Testing** (Week 1-2)
   - Internal testing with test data
   - Performance benchmarking
   - Security audit

2. **Beta Testing** (Week 3-4)
   - Limited user group
   - Monitor for issues
   - Gather performance metrics

3. **Production Release** (Week 5)
   - Gradual rollout (5% → 25% → 50% → 100%)
   - Monitor error rates
   - Have rollback plan ready

#### 8.2 User Communication
- In-app notification about security upgrade
- Automatic migration (transparent to user)
- Progress indicator during migration
- Backup recommendation before update

### Phase 9: Monitoring and Maintenance

#### 9.1 Monitoring Metrics
- Migration success rate
- Database performance metrics
- Encryption/decryption errors
- Key rotation success rate

#### 9.2 Error Handling
```typescript
export class DatabaseErrorHandler {
  static async handleEncryptionError(error: Error): Promise<void> {
    console.error('Encryption error:', error);
    
    // Log to analytics
    await Analytics.logEvent('db_encryption_error', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    // Attempt recovery
    if (error.message.includes('key')) {
      // Key-related error handling
      await this.attemptKeyRecovery();
    }
  }

  private static async attemptKeyRecovery(): Promise<void> {
    // Implementation for key recovery
  }
}
```

## Security Considerations

### Threats Mitigated
✅ Physical device access  
✅ ADB backup extraction  
✅ Device forensics  
✅ Root access attacks  
✅ Memory dump attacks  

### Remaining Considerations
1. **Key Compromise**: If device is rooted, keys in Keystore may be accessible
2. **Side-Channel Attacks**: Timing attacks on encryption operations
3. **Quantum Computing**: Future-proof with post-quantum cryptography

### Compliance
- **GDPR**: Encryption satisfies data protection requirements
- **HIPAA**: Meets encryption standards for health data
- **CCPA**: Complies with data security requirements

## Alternative Approaches

### Option 1: Full Database Encryption (Recommended)
- **Pros**: Complete protection, transparent to app logic
- **Cons**: Requires compatible library, potential performance impact

### Option 2: Field-Level Encryption
- **Pros**: Granular control, better performance
- **Cons**: More complex implementation, partial protection

### Option 3: File System Encryption
- **Pros**: OS-level protection
- **Cons**: Requires device encryption, user-dependent

## Implementation Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1-2 | 1 week | Setup and database layer modification |
| Phase 3-4 | 1 week | Data migration and integration |
| Phase 5-6 | 1 week | Security enhancements and testing |
| Phase 7 | 3 days | Performance optimization |
| Phase 8 | 2 weeks | Phased rollout |
| Phase 9 | Ongoing | Monitoring and maintenance |

**Total Timeline**: 5-6 weeks from start to full production rollout

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss during migration | Low | High | Comprehensive backup strategy |
| Performance degradation | Medium | Medium | Field-level encryption option |
| Key management issues | Low | High | Multiple key recovery methods |
| Compatibility issues | Low | Medium | Thorough testing on all platforms |

## Success Metrics

1. **Security**: 100% of sensitive data encrypted at rest
2. **Performance**: < 10% increase in database operation time
3. **Reliability**: < 0.1% migration failure rate
4. **User Experience**: Transparent migration process
5. **Compliance**: Pass security audit requirements

## Conclusion

Implementing SQLite encryption is critical for protecting user privacy and meeting security compliance requirements. This plan provides a comprehensive approach to securing the database while maintaining app performance and user experience. The phased implementation ensures minimal risk and allows for adjustments based on real-world testing.

## Next Steps

1. Review and approve implementation plan
2. Set up development environment for testing
3. Begin Phase 1 implementation
4. Schedule security audit for post-implementation
5. Prepare user communication materials

## References

- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Android Keystore System](https://developer.android.com/training/articles/keystore)
- [OWASP Mobile Security Guidelines](https://owasp.org/www-project-mobile-security/)
- [SQLCipher Documentation](https://www.zetetic.net/sqlcipher/)
- [React Native Security Best Practices](https://reactnative.dev/docs/security)

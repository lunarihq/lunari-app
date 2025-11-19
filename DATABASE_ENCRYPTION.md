# Database Encryption & Authentication Architecture

## Overview

This document explains how database encryption and authentication work in the Lunari app. The system uses **SQLCipher** for database encryption with a two-tier key management system that supports both basic and biometric-protected modes.

## Core Architecture

The app uses **SQLCipher** for database encryption with a two-tier key management system:

- **Encryption key (KEK - Key Encryption Key)**: 32-byte random hex string stored in SecureStore
- **Authentication requirement**: Boolean flag (`requiresAuth`)
  - `false`: No biometric authentication required
  - `true`: Requires biometric authentication to access the key

## Important: When Encryption Happens

**The database is encrypted from the very first install**, even before the user enables biometric protection.

On first install:
1. A random encryption key is generated
2. The key is stored in SecureStore with `requireAuthentication: false` (basic mode)
3. The database is immediately opened with `PRAGMA key` using that key
4. All data written to the database is encrypted at rest

**The difference between modes:**
- **Basic mode**: Database is encrypted, but accessing the key from SecureStore doesn't require biometric
- **Protected mode**: Database is encrypted, AND accessing the key requires biometric authentication

**Key point**: Enabling biometric protection does NOT re-encrypt the database. The same encryption key is used - only the protection level of the key storage changes. The database encryption itself is always active from day one.

## The Flow

### 1. App Startup (`useAppInitialization.ts`)

The app initialization hook manages the entire startup lifecycle:

```
App launches → appState = 'initializing' → setupDatabase()
```

**Key Code:**
```typescript
const setupDatabase = useCallback(async () => {
  if (setupInProgress.current) return;
  setupInProgress.current = true;

  try {
    startAuthentication();
    await initializeDatabase();
    unlockApp();
    endAuthentication();
    setAppState(createCheckingOnboardingState());
  } catch (error) {
    endAuthentication();
    if (
      error instanceof EncryptionError &&
      error.code === ERROR_CODES.USER_CANCELLED
    ) {
      try {
        await clearKeyCache();
        await clearDatabaseCache();
      } catch (cleanupError) {
        console.error('[AppLayout] Cache cleanup failed:', cleanupError);
      } finally {
        setAppState(createLockedState('auth_cancelled'));
      }
    } else {
      console.error('[AppLayout] Database initialization error:', error);
      setAppState(
        createErrorState(
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  } finally {
    setupInProgress.current = false;
  }
}, [unlockApp, startAuthentication, endAuthentication]);
```

### 2. Database Initialization (`db/index.ts`)

This is where SQLCipher gets configured with the encryption key:

```typescript
export async function initializeDatabase(): Promise<void> {
  if (db) {
    return;
  }

  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  initializationPromise = (async () => {
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
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}
```

### 3. Encryption Key Management (`databaseEncryptionService.ts`)

The encryption service has three main operations:

#### A. First Time (No Key Exists)

```typescript
async function createNewKey(): Promise<string> {
  const keyHex = generateRandomKeyHex();
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, keyHex, { requireAuthentication: false });
  await setKeyRequiresAuth(false);
  return keyHex;
}
```

#### B. Loading Existing Key

```typescript
async function loadExistingKey(): Promise<string> {
  const requiresAuth = await getKeyRequiresAuth();
  let keyHex: string | null;
  
  try {
    keyHex = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.ENCRYPTION_KEY, 
      { requireAuthentication: requiresAuth }
    );
  } catch (error) {
    // Mode desync: AsyncStorage says no auth but key requires auth
    if (!requiresAuth && isAuthenticationError(error)) {
      keyHex = await SecureStore.getItemAsync(
        SECURE_STORE_KEYS.ENCRYPTION_KEY, 
        { requireAuthentication: true }
      );
      await setKeyRequiresAuth(true);
    } else {
      throw error;
    }
  }
  
  if (!keyHex) {
    throw new EncryptionError(ERROR_CODES.KEY_NOT_FOUND, 'Encryption key is missing. Your data cannot be decrypted.');
  }

  return keyHex;
}
```

**Important**: If `requiresAuth` is `true`, this automatically triggers the biometric prompt.

#### C. Re-wrapping (Changing Protection Mode)

```typescript
export async function reWrapKEK(requireAuth: boolean): Promise<void> {
  if (!keyCache) {
    throw new EncryptionError(ERROR_CODES.UNINITIALIZED_ENCRYPTION, 'Encryption key not initialized.');
  }

  if (keyRewrappingPromise) {
    return keyRewrappingPromise;
  }
  
  keyRewrappingPromise = (async () => {
    try {
      await SecureStore.setItemAsync(
        SECURE_STORE_KEYS.ENCRYPTION_KEY, 
        keyCache, 
        { requireAuthentication: requireAuth }
      );
      await setKeyRequiresAuth(requireAuth);
    } catch (error) {
      if (error instanceof EncryptionError) throw error;
      if (isAuthenticationError(error)) {
        throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
      }
      throw error;
    } finally {
      keyRewrappingPromise = null;
    }
  })();

  return keyRewrappingPromise;
}
```

**Note**: The actual encryption key never changes - only the protection level (whether biometric is required) changes.

### 4. Background/Foreground Security (`AuthContext.tsx`)

When the app goes to background **with lock enabled**, the system clears the key cache:

```typescript
const handleAppStateChange = useCallback(
  async (nextAppState: AppStateStatus) => {
    try {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (isAuthenticating) {
          return;
        }
        
        setAppStateBackground(true);
        if (isLockEnabled && !isRequestingPermission) {
          await clearKeyCache();
          await clearDatabaseCache();
        }
      } else if (nextAppState === 'active' && appStateBackground && isLockEnabled) {
        if (isRequestingPermission) {
          setAppStateBackground(false);
          return;
        }
        
        if (isAuthenticating) {
          setAppStateBackground(false);
          return;
        }
        
        const deviceSecurityAvailable = await AuthService.isDeviceSecurityAvailable();
        setIsDeviceSecurityAvailable(deviceSecurityAvailable);
        if (!deviceSecurityAvailable) {
          console.warn('[AuthContext] Device security not available');
          setIsLocked(true);
          setIsAuthenticated(false);
          setAppStateBackground(false);
          return;
        }

        setAppStateBackground(false);
        setJustReturnedFromBackground(true);
        setIsLocked(true);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[AuthContext] Error handling app state change:', error);
      setAppStateBackground(false);
    }
  },
  [appStateBackground, isLockEnabled, isLocked, isAuthenticated, isRequestingPermission, isAuthenticating]
);
```

**Flow:**
- **Background**: Clears key cache → Database becomes inaccessible
- **Foreground**: Sets `justReturnedFromBackground` flag → Triggers re-initialization → Biometric prompt

### 5. User-Facing Toggle (`app-lock.tsx`)

Simple UI that calls the re-wrap function:

```typescript
const handleToggle = async (value: boolean) => {
  if (value && !isDeviceSecurityAvailable) {
    Alert.alert(
      t('appLockSettings.noDeviceSecurity.title'),
      t('appLockSettings.noDeviceSecurity.message'),
      [{ text: t('appLockSettings.noDeviceSecurity.ok') }]
    );
    return;
  }

  const result = await setLockEnabled(value);
  if (result.cancelled) {
    return;
  }
  if (result.error) {
    Alert.alert(
      t('appLockSettings.error.title'),
      result.error
    );
  }
};
```

## Key Design Decisions

### Why separate mode storage?

- **AsyncStorage (mode)**: Fast, doesn't require auth - used for quick checks
- **SecureStore (key)**: Secure but slower - only accessed when needed

### Why cache the key?

- Avoids repeated biometric prompts during normal use
- Gets cleared on background for security

### Why the deduplication promises?

- Prevents race conditions if multiple components try to initialize simultaneously
- `initializationPromise`, `reWrapPromise` ensure only one operation at a time

### Error handling strategy:

- `USER_CANCELLED` → Lock screen, user can retry
- `KEY_NOT_FOUND` → Generate new key (fresh install)
- Mode desync detection → Auto-fixes if AsyncStorage/SecureStore disagree

## Complete Flow Diagram

```
App Launch
    ↓
useAppInitialization (status: 'initializing')
    ↓
setupDatabase()
    ↓
initializeDatabase() → initializeEncryption()
    ↓
[First time?] → createNewKey() → Store in SecureStore (basic mode)
[Existing?] → loadExistingKey() → [Protected mode?] → **BIOMETRIC PROMPT**
    ↓
keyCache filled with encryption key
    ↓
SQLite opens with PRAGMA key
    ↓
status: 'checking_onboarding' → status: 'ready'
    ↓
App usable

[User toggles App Lock ON]
    ↓
reWrapKEK(true) → **BIOMETRIC PROMPT** → Re-save key with requireAuthentication
    ↓
requiresAuth set to true

[App goes to background with lock enabled]
    ↓
clearKeyCache() + clearDatabaseCache()
    ↓
[App returns to foreground]
    ↓
justReturnedFromBackground = true
    ↓
status: 'locked' → setupDatabase() again → **BIOMETRIC PROMPT**
```

## Security Properties

1. **Database is always encrypted** - Even when `requiresAuth` is `false`, data is encrypted at rest
2. **Key never leaves SecureStore** - Only cached in memory temporarily
3. **Background clears memory** - No key persists when app is backgrounded
4. **Biometric re-authentication** - Required every time app returns if lock enabled
5. **Rollback on failure** - If re-wrap fails, reverts to previous mode

## File Reference

- `services/databaseEncryptionService.ts` - Core encryption key management
- `db/index.ts` - Database initialization with SQLCipher
- `hooks/useAppInitialization.ts` - App startup flow
- `contexts/AuthContext.tsx` - Background/foreground security handling
- `app/settings/app-lock.tsx` - User interface for toggling lock
- `types/appState.ts` - App state type definitions
- `services/authService.ts` - Device security availability checks

## User edge cases that are not currently handled

### 1.⚠️Critical: User removes device security after enabling protected mode

**Scenario:**
- User enables biometric lock (requiresAuth = true)
- Later removes ALL biometric/PIN from their device
- Opens app

**What happens:**
- `initializeAuth()` → lockEnabled=true, deviceSecurityAvailable=false
- `setupDatabase()` → `initializeEncryption()`
- `loadExistingKey()` → tries to get key with requireAuthentication=true
- SecureStore fails → no biometric/PIN available
- Error thrown → app shows "Database Error"

**Result:**
User is permanently locked out. Retry button doesn't help because device still has no security.
Fix needed: Detect this scenario and either:

- Force downgrade to basic mode (requires storing backup recovery method)
- Show specific error: "Please set up device security or data will be lost"
- Provide escape hatch to delete data and start fresh

### 2.⚠️Critical: User's device storage is corrupted/cleared, encryption key is lost, but the database file survives.

**What happens:**
- loadExistingKey() fails (key missing)
createNewKey() generates a new key
- initializeDatabase() tries to open the database with the new key
- SQLCipher test query fails: await expo.getAllAsync('SELECT count(*) FROM sqlite_master;')
- App crashes/shows generic error

**Result:** The user loses all their data with no clear explanation.

**What should happen:**
You should detect this scenario and handle it explicitly:

// In initializeDatabase(), after getting the key:
try {
  await expo.getAllAsync('SELECT count(*) FROM sqlite_master;');
} catch (error) {
  // This could mean wrong key (old database exists)
  // Or corrupted database
  
  // Option 1: Delete old database and start fresh
  // Option 2: Show clear error to user
  // Option 3: Try to export/backup before deleting
}

Recommendations
- Detect key mismatch: Check if database exists when creating a new key
- User notification: Tell them their data can't be recovered
- Clean slate: Delete the old database file before creating a new one
- Optional: Add key backup/recovery mechanism (though this weakens security)

### 3.⚠️Moderate: Rollback fails during setLockEnabled

**Scenario:**
- User toggles lock setting
- `reWrapKEK(enabled)` succeeds
- `AuthService.setLockEnabled(enabled)` fails
- Rollback `reWrapKEK(!enabled)` also fails

**Result:** App in inconsistent state:
- SecureStore might have key with one protection level
- AsyncStorage mode says something different
- User sees error but unclear what to do

**Fix neededt:**
Add recovery mechanism, force mode sync, or nuclear option to reset encryption state.

### Edge cases that ARE handled well:**
- Mode desync (auto-fixed)
- Rapid background/foreground (guarded with isAuthenticating)
- User cancels biometric (can retry)
- App crash during re-wrap (mode desync recovery fixes it)

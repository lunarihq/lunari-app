# Database Encryption Implementation Plan

## Overview

Implement SQLCipher encryption with two-tier key architecture (DEK + KEK) per `arch.md`. DEK encrypts the database and never changes. KEK wraps the DEK and can be re-wrapped with different authentication requirements.

## Task 1: Database Encryption Without Device Authentication

**Goal**: Implement "Initial State" - encrypted database with `requireAuthentication: false` on KEK.

### Files to Create

**`services/databaseEncryptionService.ts`**
- Generate random 256-bit DEK and KEK on first launch
- Wrap DEK with KEK using AES-256-GCM
- Store wrapped DEK and KEK in SecureStore
- Export `getDEK()` to unwrap and return DEK for SQLCipher
- Export `getEncryptionMode()` to query current state

### Files to Modify

**`db/index.ts`**
- Convert `openDatabaseSync()` to `openDatabaseAsync()`
- Retrieve DEK and configure SQLCipher PRAGMAs (key, cipher_page_size, kdf_iter)
- Export `initializeDatabase()` instead of immediate initialization
- Export `getDB()` that throws if not initialized

**`app/_layout.tsx`**
- Call `initializeDatabase()` in useEffect on mount
- Show loading screen during initialization
- Handle errors with retry option

**10 Database Consumer Files** (hooks/useCalendarData.ts, hooks/useHealthLogDates.ts, services/dataDeletionService.ts, services/notificationService.ts, components/QuickHealthSelector.tsx, app/onboarding/last-period-date.tsx, app/(tabs)/stats.tsx, app/(tabs)/index.tsx, app/edit-period.tsx, app/health-tracking.tsx)
- Wait for database initialization before access
- Show loading states appropriately
- Handle initialization errors

### Critical Test Scenarios

**Key Management:**
- Fresh install generates random DEK and KEK
- Multiple calls to getDEK() return identical DEK
- DEK unwrapping fails gracefully with corrupted KEK
- Keys persist across app restarts
- Missing keys trigger fresh generation

**Database Operations:**
- SQLCipher PRAGMAs are set correctly
- All CRUD operations work with encrypted database
- Drizzle ORM functions correctly
- Initialization retry works after failure

**Edge Cases:**
- Concurrent database access during initialization is queued
- SecureStore unavailable shows critical error
- App cold start time < 1 second

## Task 2: Device Authentication Integration

**Goal**: Implement "After User Enables Lock" - re-wrap KEK with `requireAuthentication: true` when lock enabled.

### Files to Modify

**`services/databaseEncryptionService.ts`**
- Add `reWrapKEK(requireAuth: boolean)` - unwrap DEK with old KEK, generate new KEK, re-wrap DEK, delete old KEK
- Add `getEncryptionMode()` - returns 'basic' | 'protected'
- Must be atomic: either fully succeeds or rolls back

**`contexts/AuthContext.tsx`**
- Call `reWrapKEK(true)` when enabling PIN/biometric lock
- Call `reWrapKEK(false)` when disabling lock
- Add `isReWrapping` state for progress UI
- Rollback lock state on re-wrapping failure
- No re-wrapping when switching between PIN ↔ biometric

**`app/settings/app-lock.tsx`**
- Display current encryption mode ("Basic Encryption" vs "Device-Protected Encryption")
- Show progress indicator during re-wrapping
- Display error on failure with retry option
- Warning about data loss if device credentials forgotten

**`app/(tabs)/settings.tsx`**
- Add encryption status badge to App Lock row
- Update badge when mode changes

### Critical Test Scenarios

**Re-wrapping:**
- reWrapKEK(true) stores KEK with requireAuthentication: true
- reWrapKEK(false) stores KEK with requireAuthentication: false
- DEK value unchanged after re-wrapping
- Old KEK deleted after successful re-wrapping
- Failed re-wrapping leaves original KEK intact
- Re-wrapping completes in < 100ms

**Lock Integration:**
- Enabling lock triggers re-wrapping before lock state changes
- Disabling lock triggers re-wrapping before lock state changes
- PIN ↔ biometric switch doesn't trigger re-wrapping
- UI shows loading state during re-wrapping

**Device Authentication:**
- getDEK() requires device auth when requireAuthentication: true
- User canceling biometric prompt fails getDEK()
- Wrong device PIN fails getDEK()

**Error Handling:**
- Re-wrapping failure displays error and doesn't change lock state
- SecureStore failure during re-wrapping rolls back
- User can retry after failure

## Technical Notes

### SQLCipher Configuration
```sql
PRAGMA key = "x'[DEK_HEX]'";
PRAGMA cipher_page_size = 4096;
PRAGMA kdf_iter = 256000;
```

### SecureStore Keys
- `encrypted_dek`: Wrapped DEK (base64, AES-256-GCM)
- `kek`: KEK (hex string, 64 chars)

### Performance Targets
- Cold start: < 100ms overhead
- Key unwrapping: < 50ms
- Re-wrapping: < 100ms
- Query performance: < 10% degradation

### Security
- **DEK**: Lives in memory during database use (unavoidable with SQLCipher)
- **Basic mode**: KEK extractable on rooted devices
- **Protected mode**: KEK requires device authentication (biometric/PIN/pattern), hardware-backed when available (automatic)
- **Data loss**: Forgotten device credentials = permanent data loss

### Error Handling
- Missing keys → regenerate (pre-launch acceptable)
- Corrupted keys → show error, offer data reset
- SecureStore unavailable → critical error, block app
- Re-wrapping failure → atomic rollback

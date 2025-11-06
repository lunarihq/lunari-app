# Database Encryption: Architecture vs Implementation Analysis

## Overview

This document compares the database encryption architecture specification (`arch.md`) with the current implementation to verify compliance.

## Core Architecture - ✅ MATCHES

The implementation correctly follows the KEK/DEK (Key Encryption Key / Data Encryption Key) model:

### DEK (Data Encryption Key)
- ✅ Generated as 256-bit random key (`Crypto.getRandomBytes(32)`)
- ✅ Encrypts SQLCipher database
- ✅ Remains constant after creation (never regenerated during mode transitions)
- ✅ Cached in memory during database use
- ✅ Cleared from cache when app backgrounds in protected mode

### KEK (Key Encryption Key)
- ✅ Generated as 256-bit random key
- ✅ Wraps/unwraps the DEK using AES-GCM encryption
- ✅ Stored in SecureStore with appropriate `requireAuthentication` flag

## Initial State (Basic Mode) - ✅ MATCHES

**Architecture Spec:**
- Random DEK encrypts database
- Random KEK stored in SecureStore with `requireAuthentication: false`
- Provides baseline protection (OS-level only)

**Implementation:**
When no keys exist, the system:
1. Generates a random 256-bit DEK
2. Generates a random 256-bit KEK
3. Wraps DEK with KEK using AES-GCM
4. Stores KEK in SecureStore with `requireAuthentication: false`
5. Stores wrapped DEK in SecureStore
6. Sets encryption mode to `'basic'`

**Status:** ✅ Correctly implemented

## After User Enables Lock (Protected Mode) - ✅ MATCHES

**Architecture Spec:**
- Random DEK continues encrypting database (unchanged)
- New random KEK stored in SecureStore with `requireAuthentication: true`
- KEK protected by device authentication (biometric, device PIN, pattern, or password)
- Old KEK securely deleted
- Transition: Unwrap DEK with old KEK, wrap with new KEK (milliseconds, show progress indicator)

**Implementation:**
The `reWrapKEK()` function:
1. Retrieves old KEK (with authentication if in protected mode)
2. Unwraps DEK using old KEK
3. Generates new random KEK
4. Wraps DEK with new KEK
5. Deletes old KEK from SecureStore
6. Stores new KEK with `requireAuthentication: true`
7. Updates wrapped DEK
8. Updates encryption mode to `'protected'`

**Key Points:**
- ✅ Database is never touched - only key wrapping changes
- ✅ DEK remains constant throughout transition
- ✅ Old KEK is securely deleted
- ✅ Operation is fast (milliseconds) as specified

**Status:** ✅ Correctly implemented

## Mode Transition (reWrapKEK) - ✅ MATCHES

The implementation correctly handles transitions between basic and protected modes:

1. **Unwraps DEK** with old KEK (requires authentication if transitioning from protected mode)
2. **Generates new random KEK**
3. **Wraps DEK** with new KEK
4. **Deletes old KEK** securely
5. **Stores new KEK** with appropriate `requireAuthentication` flag
6. **Updates wrapped DEK** in SecureStore
7. **Updates encryption mode** flag

**Status:** ✅ Correctly implemented - no database re-encryption occurs

## Database Integration - ✅ MATCHES

**Architecture Spec:**
- Use SQLCipher (natively supported by expo-sqlite) with DEK

**Implementation:**
- SQLCipher database opened with DEK via `PRAGMA key`
- DEK retrieved from cache (populated after unwrapping with KEK)
- Database encryption parameters configured:
  - `cipher_page_size = 4096`
  - `kdf_iter = 256000`

**Status:** ✅ Correctly implemented

## Security Lifecycle - ✅ MATCHES

**Architecture Spec:**
- DEK in memory during database use (unavoidable with SQLCipher)
- Initial state provides only partial protection (no hardware enforcement)

**Implementation:**
- DEK cached in memory during app use
- DEK cache cleared when app backgrounds in protected mode
- Database cache cleared when app backgrounds in protected mode
- On app foreground, user must authenticate to retrieve KEK and unwrap DEK

**Status:** ✅ Correctly implemented

## Encryption Algorithm

**Implementation Details:**
- Uses AES-GCM (Galois/Counter Mode) via `@noble/ciphers/aes.js`
- 256-bit keys (32 bytes)
- 12-byte nonce for GCM
- Wrapped DEK stored as base64-encoded JSON containing nonce and ciphertext

**Status:** ✅ Secure and appropriate choice

## Error Handling

**Implementation includes:**
- User cancellation detection (biometric prompt cancelled)
- Migration path for old key formats
- Rollback mechanism if mode transition fails
- Proper error propagation

**Status:** ✅ Robust error handling

## Verdict: Implementation MATCHES Architecture ✅

The implementation correctly follows the architecture specification. All key design goals are met:

- ✅ DEK never changes (no database re-encryption)
- ✅ Mode transitions only re-wrap keys (fast operation)
- ✅ Basic mode: KEK with `requireAuthentication: false`
- ✅ Protected mode: KEK with `requireAuthentication: true`
- ✅ Old KEK securely deleted during transitions
- ✅ DEK cached in memory, cleared on background when protected
- ✅ SQLCipher integration uses DEK directly
- ✅ Secure encryption algorithm (AES-GCM)

## Architecture Compliance Checklist

- [x] Random 256-bit DEK encrypts database
- [x] DEK remains constant - never changes once set
- [x] Random KEK wraps/unwraps the DEK, stored in SecureStore
- [x] Mode transitions only re-wrap the DEK (fast) - never re-encrypt the database
- [x] Initial state: KEK with `requireAuthentication: false`
- [x] Protected state: KEK with `requireAuthentication: true`
- [x] Old KEK securely deleted during transitions
- [x] DEK in memory during database use (unavoidable limitation acknowledged)
- [x] DEK cache cleared on app background in protected mode

## Notes

- The implementation uses AES-GCM for key wrapping, which is a secure and auditable choice
- Error handling includes migration paths for legacy key formats
- The system properly handles user cancellation of biometric prompts
- Database encryption uses industry-standard SQLCipher with appropriate parameters


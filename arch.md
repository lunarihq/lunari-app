# Database Encryption Architecture

Use SQLCipher (natively supported by expo-sqlite) with a Key Encryption Key (KEK):

- Random 256-bit Data Encryption Key (DEK) encrypts the database
- DEK remains constant - never changes once set
- Random KEK wraps/unwraps the DEK, stored in SecureStore
- Mode transitions only re-wrap the DEK (fast) - never re-encrypt the database

## Initial State (Lock Disabled - Default)

- Random DEK encrypts database
- Random KEK stored in SecureStore with `requireAuthentication: false`
- Provides baseline protection (OS-level only)
- Extractable on rooted/compromised devices

## After User Enables Lock

- Random DEK continues encrypting database (unchanged)
- New random KEK stored in SecureStore with `requireAuthentication: true`
- KEK protected by device authentication (biometric, device PIN, pattern, or password - whatever the device has configured)
- On hardware-backed devices: Key cannot be extracted without authentication, with hardware-enforced rate limiting and anti-extraction protections
- Old KEK securely deleted
- Transition: Unwrap DEK with old KEK, wrap with new KEK (milliseconds, show progress indicator)

## Limitations

- DEK in memory during database use (unavoidable with SQLCipher)
- Initial state provides only partial protection (no hardware enforcement)
- Forgotten device credentials = permanent data loss
- Hardware-backed SecureStore availability and protection strength varies by device

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const SECURE_STORE_KEYS = {
  ENCRYPTION_KEY: 'encryption_key',
};

const ASYNC_STORAGE_KEYS = {
  KEY_REQUIRES_AUTH: 'key_requires_auth',
};

export class EncryptionError extends Error {
  constructor(public code: keyof typeof ERROR_CODES, message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export const ERROR_CODES = {
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  KEY_NOT_FOUND: 'KEY_NOT_FOUND',
  KEY_CORRUPTED: 'KEY_CORRUPTED',
  UNINITIALIZED_ENCRYPTION: 'UNINITIALIZED_ENCRYPTION',
  ORPHANED_DATABASE: 'ORPHANED_DATABASE',
} as const;

let keyCache: string | null = null;
let initializationPromise: Promise<void> | null = null;
let keyRewrappingPromise: Promise<void> | null = null;

function generateRandomKeyHex(): string {
  const bytes = Crypto.getRandomBytes(32);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// expo-secure-store v15.0.7 error handling:
// Android: All authentication failures throw ERR_AUTHENTICATION (user cancellation,
//   biometrics not enrolled, hardware unavailable, etc. - cannot be distinguished)
// iOS: Authentication failures throw ERR_KEY_CHAIN with OSStatus codes in message
//   (errSecUserCanceled, errSecAuthFailed, errSecInteractionNotAllowed, etc.)
// 
// Since we cannot reliably distinguish between different failure types across platforms,
// we treat all authentication errors uniformly and present user-friendly guidance.
function isAuthenticationError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as any).code;
  // Android authentication errors
  if (code === 'ERR_AUTHENTICATION') return true;
  // iOS authentication errors (keychain access failures)
  if (code === 'ERR_KEY_CHAIN') {
    const message = error.message.toLowerCase();
    return message.includes('canceled') || 
           message.includes('authentication') || 
           message.includes('interaction not allowed');
  }
  return false;
}


async function createNewKey(): Promise<string> {
  const keyHex = generateRandomKeyHex();
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, keyHex, { requireAuthentication: false });
  await setKeyRequiresAuth(false);
  return keyHex;
}

async function loadExistingKey(): Promise<string> {
  const requiresAuth = await getKeyRequiresAuth();
  let keyHex: string | null;
  
  try {
    keyHex = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.ENCRYPTION_KEY, 
      { requireAuthentication: requiresAuth }
    );
  } catch (error) {
    // Mode desync recovery: On iOS, SecureStore (Keychain) can survive app uninstall
    // whilst AsyncStorage is cleared. After reinstall, AsyncStorage defaults to false
    // but the persisted key still requires authentication. Retry with auth and update mode.
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
    throw new EncryptionError(
      ERROR_CODES.KEY_NOT_FOUND,
      'Encryption key is missing. Your data cannot be decrypted.');
  }

  // Validate: exactly 64 hex characters (256 bits)
  const hexPattern = /^[0-9a-f]{64}$/i;
  if (!hexPattern.test(keyHex)) {
    throw new EncryptionError(
      ERROR_CODES.KEY_CORRUPTED, 
      'Stored encryption key is corrupted or invalid.'
    );
  }

  return keyHex;
}

export async function initializeEncryption(): Promise<{ wasKeyJustCreated: boolean }> {
  if (keyCache) {
    return { wasKeyJustCreated: false };
  }

  if (initializationPromise) {
    await initializationPromise;
    return { wasKeyJustCreated: false };
  }

  let wasKeyCreated = false;

  initializationPromise = (async () => {
    try {
      keyCache = await loadExistingKey();
    } catch (error) {
      if (error instanceof EncryptionError && error.code === ERROR_CODES.KEY_NOT_FOUND) {
        keyCache = await createNewKey();
        wasKeyCreated = true;
      } else {
        if (error instanceof EncryptionError) throw error;
        if (isAuthenticationError(error)) {
          throw new EncryptionError(
            ERROR_CODES.AUTHENTICATION_FAILED, 
            'Authentication failed or unavailable. Please ensure biometric authentication is set up on your device.'
          );
        }
        throw error;
      }
    } finally {
      initializationPromise = null;
    }
  })();

  await initializationPromise;
  return { wasKeyJustCreated: wasKeyCreated };
}

export async function getKeyRequiresAuth(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.KEY_REQUIRES_AUTH);
  return value === 'true';
}

async function setKeyRequiresAuth(requiresAuth: boolean): Promise<void> {
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.KEY_REQUIRES_AUTH, String(requiresAuth));
}

export function getEncryptionKeyHex(): string {
  if (!keyCache) {
    throw new EncryptionError(ERROR_CODES.UNINITIALIZED_ENCRYPTION, 'Encryption key not initialized. Call initializeEncryption first.');
  }
  return keyCache;
}

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
        throw new EncryptionError(
          ERROR_CODES.AUTHENTICATION_FAILED, 
          'Authentication failed or unavailable. Please ensure biometric authentication is set up on your device.'
        );
      }
      throw error;
    } finally {
      keyRewrappingPromise = null;
    }
  })();

  return keyRewrappingPromise;
}

export async function clearKeyCache(): Promise<void> {
  if (initializationPromise) {
    try {
      await initializationPromise;
    } catch {
      // Swallow errors from initialization since we're clearing anyway
    }
  }
  if (keyRewrappingPromise) {
    try {
      await keyRewrappingPromise;
    } catch {
      // Swallow errors from key rewrapping since we're clearing anyway
    }
  }
  keyCache = null;
  initializationPromise = null;
  keyRewrappingPromise = null;
}

export async function deleteEncryptionKey(): Promise<void> {
  if (initializationPromise) {
    try {
      await initializationPromise;
    } catch {
      // Swallow errors since we're deleting anyway
    }
  }
  if (keyRewrappingPromise) {
    try {
      await keyRewrappingPromise;
    } catch {
      // Swallow errors since we're deleting anyway
    }
  }
  
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.KEY_REQUIRES_AUTH);
  } finally {
    keyCache = null;
    initializationPromise = null;
    keyRewrappingPromise = null;
  }
}

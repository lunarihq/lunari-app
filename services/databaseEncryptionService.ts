import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const SECURE_STORE_KEYS = {
  ENCRYPTION_KEY: 'encryption_key',
};

const ASYNC_STORAGE_KEYS = {
  ENCRYPTION_MODE: 'encryption_mode',
};

export type EncryptionMode = 'basic' | 'protected';

export class EncryptionError extends Error {
  constructor(public code: keyof typeof ERROR_CODES, message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export const ERROR_CODES = {
  USER_CANCELLED: 'USER_CANCELLED',
  KEY_NOT_FOUND: 'KEY_NOT_FOUND',
  UNINITIALIZED_ENCRYPTION: 'UNINITIALIZED_ENCRYPTION',
} as const;

let keyCache: string | null = null;
let initializationPromise: Promise<void> | null = null;
let reWrapPromise: Promise<void> | null = null;

function generateRandomKeyHex(): string {
  const bytes = Crypto.getRandomBytes(32);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isCancellationError(error: unknown): boolean {
  const code = (error as any)?.code;
  const message = (error as any)?.message || '';
  
  return code === 'ERR_AUTHENTICATION' && 
         message.toLowerCase().includes('cancel');
}

function isAuthenticationRequiredError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  // Primary check: the documented error code
  const code = (error as any).code;
  if (code === 'ERR_SECURESTORE_AUTHENTICATION_REQUIRED') return true;
  // Secondary check: error name (some native modules use this)
  if (error.name === 'ERR_SECURESTORE_AUTHENTICATION_REQUIRED') return true;
  
  return false;
}


async function createNewKey(): Promise<string> {
  const keyHex = generateRandomKeyHex();
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, keyHex, { requireAuthentication: false });
  await setStoredEncryptionMode('basic');
  return keyHex;
}

async function loadExistingKey(): Promise<string> {
  const mode = await getEncryptionMode();
  let keyHex: string | null;
  
  try {
    keyHex = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.ENCRYPTION_KEY, 
      { requireAuthentication: mode === 'protected' }
    );
  } catch (error) {
    // Mode desync: AsyncStorage says 'basic' but key requires auth
    if (mode !== 'protected' && isAuthenticationRequiredError(error)) {
      keyHex = await SecureStore.getItemAsync(
        SECURE_STORE_KEYS.ENCRYPTION_KEY, 
        { requireAuthentication: true }
      );
      await setStoredEncryptionMode('protected');
    } else {
      throw error;
    }
  }
  
  if (!keyHex) {
    throw new EncryptionError(ERROR_CODES.KEY_NOT_FOUND, 'Encryption key is missing. Your data cannot be decrypted.');
  }

  if (keyHex.length !== 64) {
    throw new EncryptionError(ERROR_CODES.KEY_NOT_FOUND, 'Stored encryption key is corrupted.');
  }

  return keyHex;
}

export async function initializeEncryption(): Promise<void> {
  if (keyCache) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      keyCache = await loadExistingKey();
    } catch (error) {
      if (error instanceof EncryptionError && error.code === ERROR_CODES.KEY_NOT_FOUND) {
        keyCache = await createNewKey();
      } else {
        if (error instanceof EncryptionError) throw error;
        if (isCancellationError(error)) {
          throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
        }
        throw error;
      }
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

export async function getEncryptionMode(): Promise<EncryptionMode> {
  const mode = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ENCRYPTION_MODE);
  return mode === 'protected' ? 'protected' : 'basic';
}

async function setStoredEncryptionMode(mode: EncryptionMode): Promise<void> {
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ENCRYPTION_MODE, mode);
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

  if (reWrapPromise) {
    return reWrapPromise;
  }

  const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';
  
  reWrapPromise = (async () => {
    try {
      await SecureStore.setItemAsync(
        SECURE_STORE_KEYS.ENCRYPTION_KEY, 
        keyCache, 
        { requireAuthentication: requireAuth }
      );
      await setStoredEncryptionMode(newMode);
    } catch (error) {
      if (error instanceof EncryptionError) throw error;
      if (isCancellationError(error)) {
        throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
      }
      throw error;
    } finally {
      reWrapPromise = null;
    }
  })();

  return reWrapPromise;
}

export async function clearKeyCache(): Promise<void> {
  if (initializationPromise) {
    try {
      await initializationPromise;
    } catch {
      // Swallow errors from initialization since we're clearing anyway
    }
  }
  if (reWrapPromise) {
    try {
      await reWrapPromise;
    } catch {
      // Swallow errors from reWrap since we're clearing anyway
    }
  }
  keyCache = null;
  initializationPromise = null;
  reWrapPromise = null;
}

export async function deleteEncryptionKey(): Promise<void> {
  if (initializationPromise) {
    try {
      await initializationPromise;
    } catch {
      // Swallow errors since we're deleting anyway
    }
  }
  if (reWrapPromise) {
    try {
      await reWrapPromise;
    } catch {
      // Swallow errors since we're deleting anyway
    }
  }
  
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.ENCRYPTION_MODE);
    keyCache = null;
    initializationPromise = null;
    reWrapPromise = null;
  } catch (error) {
    console.error('Error clearing keys:', error);
  }
}

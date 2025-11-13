import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as base64 from 'base64-js';

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
} as const;

let keyCache: Uint8Array | null = null;
let initializationPromise: Promise<void> | null = null;

function generateRandomKey(): Uint8Array {
  return Crypto.getRandomBytes(32);
}

function isCancellationError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  
  const name = (error as any).name;
  if (name === 'NotAllowedError' || name === 'ERR_CANCELED') return true;
  
  const code = (error as any).code;
  if (code === 'ERR_CANCELED' || code === 'USER_CANCELLED') return true;
  
  return error.message.includes('cancel');
}

function classifyError(error: unknown): never {
  if (error instanceof EncryptionError) {
    throw error;
  }

  if (isCancellationError(error)) {
    throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
  }

  throw error;
}

async function createNewKey(): Promise<Uint8Array> {
  const key = generateRandomKey();
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, base64.fromByteArray(key), { requireAuthentication: false });
  await setStoredEncryptionMode('basic');
  return key;
}

async function loadExistingKey(): Promise<Uint8Array> {
  console.log('[EncryptionService] loadExistingKey called');
  const mode = await getStoredEncryptionMode();
  console.log('[EncryptionService] Current encryption mode:', mode);
  console.log('[EncryptionService] Will require authentication:', mode === 'protected');
  
  if (mode === 'protected') {
    console.log('[EncryptionService] 🔐 BIOMETRIC PROMPT - About to trigger for key retrieval');
  }
  
  const keyBase64 = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, { requireAuthentication: mode === 'protected' });
  
  if (mode === 'protected') {
    console.log('[EncryptionService] ✅ BIOMETRIC PROMPT - Completed successfully');
  }
  
  if (!keyBase64) {
    console.error('[Encryption] Key missing');
    throw new Error('Encryption key is missing. Your data cannot be decrypted.');
  }

  console.log('[EncryptionService] Key loaded successfully');
  return base64.toByteArray(keyBase64);
}

export async function initializeEncryption(): Promise<void> {
  console.log('[EncryptionService] initializeEncryption called', {
    hasKeyCache: !!keyCache,
    hasInFlightInit: !!initializationPromise,
    timestamp: new Date().toISOString(),
  });

  if (keyCache) {
    console.log('[EncryptionService] Using cached key, skipping initialization');
    return;
  }

  if (initializationPromise) {
    console.log('[EncryptionService] Initialization already in progress, waiting...');
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('[EncryptionService] Starting fresh initialization');
      
      const hasExistingKey = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY);
      console.log('[EncryptionService] Checked for existing key:', !!hasExistingKey);
      
      if (hasExistingKey) {
        console.log('[EncryptionService] Loading existing key...');
        keyCache = await loadExistingKey();
        console.log('[EncryptionService] Existing key loaded successfully');
      } else {
        console.log('[EncryptionService] Creating new key...');
        keyCache = await createNewKey();
        console.log('[EncryptionService] New key created successfully');
      }
    } catch (error) {
      console.log('[EncryptionService] Initialization failed:', error);
      throw classifyError(error);
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

async function getStoredEncryptionMode(): Promise<EncryptionMode> {
  try {
    const mode = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ENCRYPTION_MODE);
    return mode === 'protected' ? 'protected' : 'basic';
  } catch {
    return 'basic';
  }
}

async function setStoredEncryptionMode(mode: EncryptionMode): Promise<void> {
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ENCRYPTION_MODE, mode);
}

export function getEncryptionKey(): Uint8Array {
  if (!keyCache) {
    throw new Error('Encryption key not initialized. Call initializeEncryption first.');
  }
  return keyCache;
}

export async function getEncryptionMode(): Promise<EncryptionMode> {
  try {
    return await getStoredEncryptionMode();
  } catch (error) {
    console.error('Error getting encryption mode:', error);
    return 'basic';
  }
}

export async function reWrapKEK(requireAuth: boolean): Promise<void> {
  if (!keyCache) {
    throw new Error('Encryption key not initialized.');
  }

  const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';
  
  try {
    await SecureStore.setItemAsync(
      SECURE_STORE_KEYS.ENCRYPTION_KEY, 
      base64.fromByteArray(keyCache), 
      { requireAuthentication: requireAuth }
    );
    await setStoredEncryptionMode(newMode);
  } catch (error) {
    throw classifyError(error);
  }
}

export function clearKeyCache(): void {
  console.log('[EncryptionService] clearKeyCache called', {
    hadKeyCache: !!keyCache,
  });
  keyCache = null;
}

export async function clearAllKeys(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.ENCRYPTION_MODE);
    keyCache = null;
  } catch (error) {
    console.error('Error clearing keys:', error);
  }
}

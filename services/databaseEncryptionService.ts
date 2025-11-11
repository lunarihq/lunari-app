import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as base64 from 'base64-js';

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {} as any;
}
if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  globalThis.crypto.getRandomValues = <T extends ArrayBufferView>(array: T): T => {
    const bytes = Crypto.getRandomBytes(array.byteLength);
    new Uint8Array(array.buffer, array.byteOffset, array.byteLength).set(bytes);
    return array;
  };
}

const SECURE_STORE_KEYS = {
  ENCRYPTION_KEY: 'encryption_key',
  ENCRYPTION_MODE: 'encryption_mode',
};

export type EncryptionMode = 'basic' | 'protected';

export class EncryptionError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export const ERROR_CODES = {
  USER_CANCELLED: 'USER_CANCELLED',
  KEY_CORRUPTION: 'KEY_CORRUPTION',
  SECURE_STORE_UNAVAILABLE: 'SECURE_STORE_UNAVAILABLE',
  AUTH_IN_PROGRESS: 'AUTH_IN_PROGRESS',
} as const;

let keyCache: Uint8Array | null = null;
let initPromise: Promise<void> | null = null;
let modeUpdatePromise: Promise<void> | null = null;

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

function classifyError(error: unknown): EncryptionError {
  if (error instanceof EncryptionError) {
    return error;
  }

  if (isCancellationError(error)) {
    return new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
  }

  const message = error instanceof Error ? error.message : String(error);
  
  if (message.includes('Authentication is already in progress')) {
    return new EncryptionError(ERROR_CODES.AUTH_IN_PROGRESS, 'Authentication is in progress. Please try again.');
  }

  if (message.includes('not available') || message.includes('SecureStore')) {
    console.error('[Encryption] SecureStore unavailable:', error);
    return new EncryptionError(ERROR_CODES.SECURE_STORE_UNAVAILABLE, 'Secure storage is not available on this device');
  }

  console.error('[Encryption] Unexpected error:', error);
  return new EncryptionError(ERROR_CODES.SECURE_STORE_UNAVAILABLE, 'Failed to initialize encryption - secure storage may be unavailable');
}

async function createNewKey(): Promise<Uint8Array> {
  const key = generateRandomKey();
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, base64.fromByteArray(key), { requireAuthentication: false });
  await setStoredEncryptionMode('basic');
  return key;
}

async function loadExistingKey(): Promise<Uint8Array> {
  const mode = await getStoredEncryptionMode();
  const keyBase64 = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, { requireAuthentication: mode === 'protected' });
  
  if (!keyBase64) {
    console.error('[Encryption] Key missing');
    throw new EncryptionError(ERROR_CODES.KEY_CORRUPTION, 'Encryption key is missing. Your data cannot be decrypted.');
  }

  return base64.toByteArray(keyBase64);
}

export async function initializeEncryption(): Promise<void> {
  if (keyCache) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const hasExistingKey = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY);
      keyCache = hasExistingKey ? await loadExistingKey() : await createNewKey();
    } catch (error) {
      throw classifyError(error);
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

async function getStoredEncryptionMode(): Promise<EncryptionMode> {
  try {
    const mode = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTION_MODE);
    return mode === 'protected' ? 'protected' : 'basic';
  } catch {
    return 'basic';
  }
}

async function setStoredEncryptionMode(mode: EncryptionMode): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_MODE, mode);
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
    throw new Error('Encryption key not initialized. Call initializeEncryption first.');
  }

  if (modeUpdatePromise) {
    return modeUpdatePromise;
  }

  const currentMode = await getEncryptionMode();
  if ((currentMode === 'protected') === requireAuth) return;

  const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';

  modeUpdatePromise = (async () => {
    try {
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, base64.fromByteArray(keyCache), { requireAuthentication: requireAuth });
      await setStoredEncryptionMode(newMode);
    } catch (error) {
      if (error instanceof EncryptionError) {
        throw error;
      }
      throw classifyError(error);
    } finally {
      modeUpdatePromise = null;
    }
  })();

  return modeUpdatePromise;
}

export function clearKeyCache(): void {
  keyCache = null;
  initPromise = null;
  modeUpdatePromise = null;
}

export async function clearAllKeys(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_MODE);
    keyCache = null;
    initPromise = null;
    modeUpdatePromise = null;
  } catch (error) {
    console.error('Error clearing keys:', error);
  }
}

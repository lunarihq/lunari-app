import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { gcm } from '@noble/ciphers/aes.js';
import { managedNonce } from '@noble/ciphers/utils.js';
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
  ENCRYPTED_DEK: 'encrypted_dek',
  KEK: 'kek',
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
  REWRAP_FAILED: 'REWRAP_FAILED',
  AUTH_IN_PROGRESS: 'AUTH_IN_PROGRESS',
} as const;

let dekCache: Uint8Array | null = null;
let initPromise: Promise<void> | null = null;
let reWrapPromise: Promise<void> | null = null;

function generateRandomKey(): Uint8Array {
  return Crypto.getRandomBytes(32);
}

async function wrapDEK(dek: Uint8Array, kek: Uint8Array): Promise<string> {
  const cipher = managedNonce(gcm)(kek);
  const ciphertext = cipher.encrypt(dek);
  return base64.fromByteArray(ciphertext);
}

async function unwrapDEK(wrappedDEK: string, kek: Uint8Array): Promise<Uint8Array> {
  try {
    const ciphertext = base64.toByteArray(wrappedDEK);
    const cipher = managedNonce(gcm)(kek);
    return cipher.decrypt(ciphertext);
  } catch (error) {
    console.error('Failed to unwrap DEK:', error);
    throw new Error('Failed to unwrap DEK - corrupted data or wrong KEK');
  }
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

async function createNewKeys(): Promise<Uint8Array> {
  const dek = generateRandomKey();
  const kek = generateRandomKey();
  const wrappedDEK = await wrapDEK(dek, kek);
  
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, base64.fromByteArray(kek), { requireAuthentication: false });
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, wrappedDEK);
  await setStoredEncryptionMode('basic');
  
  return dek;
}

async function loadExistingKeys(): Promise<Uint8Array> {
  const wrappedDEK = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);
  if (!wrappedDEK) {
    throw new Error('Wrapped DEK not found');
  }

  const mode = await getStoredEncryptionMode();
  const kekBase64 = await SecureStore.getItemAsync(SECURE_STORE_KEYS.KEK, { requireAuthentication: mode === 'protected' });
  
  if (!kekBase64) {
    console.error('[Encryption] KEK missing but wrapped DEK exists');
    throw new EncryptionError(ERROR_CODES.KEY_CORRUPTION, 'Encryption keys are corrupted. Your data cannot be decrypted.');
  }

  const kek = base64.toByteArray(kekBase64);
  return unwrapDEK(wrappedDEK, kek);
}

export async function initializeEncryption(): Promise<void> {
  if (dekCache) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const hasExistingKeys = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);
      dekCache = hasExistingKeys ? await loadExistingKeys() : await createNewKeys();
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

export function getDEK(): Uint8Array {
  if (!dekCache) {
    throw new Error('DEK not initialized. Call initializeEncryption first.');
  }
  return dekCache;
}

export async function getEncryptionMode(): Promise<EncryptionMode> {
  try {
    return await getStoredEncryptionMode();
  } catch (error) {
    console.error('Error getting encryption mode:', error);
    return 'basic';
  }
}

const TEMP_KEYS = {
  KEK: 'temp_kek',
  ENCRYPTED_DEK: 'temp_encrypted_dek',
  ENCRYPTION_MODE: 'temp_encryption_mode',
};

async function cleanupTempKeys(): Promise<void> {
  await Promise.allSettled([
    SecureStore.deleteItemAsync(TEMP_KEYS.KEK),
    SecureStore.deleteItemAsync(TEMP_KEYS.ENCRYPTED_DEK),
    SecureStore.deleteItemAsync(TEMP_KEYS.ENCRYPTION_MODE),
  ]);
}

async function verifyTempKeys(originalDEK: Uint8Array): Promise<void> {
  const kekBase64 = await SecureStore.getItemAsync(TEMP_KEYS.KEK, { requireAuthentication: false });
  const wrappedDEK = await SecureStore.getItemAsync(TEMP_KEYS.ENCRYPTED_DEK);
  const mode = await SecureStore.getItemAsync(TEMP_KEYS.ENCRYPTION_MODE);

  if (!kekBase64 || !wrappedDEK || !mode) {
    throw new Error('Failed to verify temporary key storage');
  }

  const kek = base64.toByteArray(kekBase64);
  const verifiedDEK = await unwrapDEK(wrappedDEK, kek);
  
  if (base64.fromByteArray(verifiedDEK) !== base64.fromByteArray(originalDEK)) {
    throw new Error('Key verification failed - unwrapped DEK mismatch');
  }
}

async function commitNewKeys(newKEK: Uint8Array, newWrappedDEK: string, newMode: EncryptionMode, requireAuth: boolean): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, base64.fromByteArray(newKEK), { requireAuthentication: requireAuth });
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, newWrappedDEK);
  await setStoredEncryptionMode(newMode);
}

async function retrieveCurrentKeys(currentMode: EncryptionMode): Promise<{ kek: Uint8Array; wrappedDEK: string }> {
  const kekBase64 = await SecureStore.getItemAsync(SECURE_STORE_KEYS.KEK, { requireAuthentication: currentMode === 'protected' });
  const wrappedDEK = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);
  
  if (!kekBase64 || !wrappedDEK) {
    throw new Error('Failed to retrieve current keys');
  }

  return { kek: base64.toByteArray(kekBase64), wrappedDEK };
}

async function createReWrappedKeys(oldKEK: Uint8Array, wrappedDEK: string): Promise<{ dek: Uint8Array; newKEK: Uint8Array; newWrappedDEK: string }> {
  const dek = await unwrapDEK(wrappedDEK, oldKEK);
  const newKEK = generateRandomKey();
  const newWrappedDEK = await wrapDEK(dek, newKEK);
  
  return { dek, newKEK, newWrappedDEK };
}

async function storeTemporaryKeys(newKEK: Uint8Array, newWrappedDEK: string, newMode: EncryptionMode): Promise<void> {
  await SecureStore.setItemAsync(TEMP_KEYS.KEK, base64.fromByteArray(newKEK), { requireAuthentication: false });
  await SecureStore.setItemAsync(TEMP_KEYS.ENCRYPTED_DEK, newWrappedDEK);
  await SecureStore.setItemAsync(TEMP_KEYS.ENCRYPTION_MODE, newMode);
}

export async function reWrapKEK(requireAuth: boolean): Promise<void> {
  if (!dekCache) {
    throw new Error('DEK not initialized. Call initializeEncryption first.');
  }

  if (reWrapPromise) {
    return reWrapPromise;
  }

  const currentMode = await getEncryptionMode();
  if ((currentMode === 'protected') === requireAuth) return;

  const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';

  reWrapPromise = (async () => {
    try {
      const { kek: oldKEK, wrappedDEK } = await retrieveCurrentKeys(currentMode);
      const { dek, newKEK, newWrappedDEK } = await createReWrappedKeys(oldKEK, wrappedDEK);

      await storeTemporaryKeys(newKEK, newWrappedDEK, newMode);
      await verifyTempKeys(dek);
      await commitNewKeys(newKEK, newWrappedDEK, newMode, requireAuth);
      await cleanupTempKeys();

      dekCache = dek;
    } catch (error) {
      await cleanupTempKeys();

      if (error instanceof EncryptionError) {
        throw error;
      }

      console.error('[Encryption] Re-wrapping failed:', error);
      throw new EncryptionError(ERROR_CODES.REWRAP_FAILED, 'Failed to re-wrap encryption key. Your data is still safe with the old settings.');
    } finally {
      reWrapPromise = null;
    }
  })();

  return reWrapPromise;
}

export function clearDEKCache(): void {
  dekCache = null;
  initPromise = null;
  reWrapPromise = null;
}

export async function clearAllKeys(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.KEK);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_MODE);
    dekCache = null;
    initPromise = null;
    reWrapPromise = null;
  } catch (error) {
    console.error('Error clearing keys:', error);
  }
}

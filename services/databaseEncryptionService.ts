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
    throw new EncryptionError(ERROR_CODES.KEY_CORRUPTION, 'Encryption key is missing. Your data cannot be decrypted.');
  }

  console.log('[EncryptionService] Key loaded successfully');
  return base64.toByteArray(keyBase64);
}

export async function initializeEncryption(): Promise<void> {
  console.log('[EncryptionService] initializeEncryption called', {
    hasKeyCache: !!keyCache,
    hasInitPromise: !!initPromise,
    timestamp: new Date().toISOString(),
  });

  if (keyCache) {
    console.log('[EncryptionService] Using cached key, skipping initialization');
    return;
  }
  
  if (initPromise) {
    console.log('[EncryptionService] Initialization already in progress, waiting...');
    return initPromise;
  }

  initPromise = (async () => {
    try {
      console.log('[EncryptionService] Starting fresh initialization');
      
      // Check if encryption mode exists (cheaper check that doesn't trigger auth)
      const mode = await getStoredEncryptionMode();
      const hasExistingKey = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTION_MODE);
      console.log('[EncryptionService] Checked for existing setup:', !!hasExistingKey, 'mode:', mode);
      
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
      console.log('[EncryptionService] Clearing initPromise');
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
  console.log('[EncryptionService] reWrapKEK called', {
    requireAuth,
    hasKeyCache: !!keyCache,
    hasModeUpdatePromise: !!modeUpdatePromise,
  });

  if (!keyCache) {
    throw new Error('Encryption key not initialized. Call initializeEncryption first.');
  }

  if (modeUpdatePromise) {
    console.log('[EncryptionService] Mode update already in progress, waiting...');
    return modeUpdatePromise;
  }

  const currentMode = await getEncryptionMode();
  console.log('[EncryptionService] Current mode:', currentMode, 'Target:', requireAuth ? 'protected' : 'basic');
  
  if ((currentMode === 'protected') === requireAuth) {
    console.log('[EncryptionService] Mode already matches target, skipping reWrap');
    return;
  }

  const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';
  console.log('[EncryptionService] Switching mode from', currentMode, 'to', newMode);

  modeUpdatePromise = (async () => {
    try {
      if (requireAuth) {
        console.log('[EncryptionService] 🔐 BIOMETRIC PROMPT - About to trigger for re-wrapping to protected mode');
      }
      
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTION_KEY, base64.fromByteArray(keyCache), { requireAuthentication: requireAuth });
      
      if (requireAuth) {
        console.log('[EncryptionService] ✅ BIOMETRIC PROMPT - Re-wrap completed successfully');
      }
      
      await setStoredEncryptionMode(newMode);
      console.log('[EncryptionService] Mode update completed successfully');
    } catch (error) {
      console.log('[EncryptionService] Mode update failed:', error);
      if (error instanceof EncryptionError) {
        throw error;
      }
      throw classifyError(error);
    } finally {
      console.log('[EncryptionService] Clearing modeUpdatePromise');
      modeUpdatePromise = null;
    }
  })();

  return modeUpdatePromise;
}

export function clearKeyCache(): void {
  console.log('[EncryptionService] clearKeyCache called', {
    hadKeyCache: !!keyCache,
    hadInitPromise: !!initPromise,
    hadModeUpdatePromise: !!modeUpdatePromise,
  });
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

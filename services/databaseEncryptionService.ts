import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { gcm } from '@noble/ciphers/aes.js';

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

let dekCache: string | null = null;

function generateRandomKey(): string {
  const randomBytes = Crypto.getRandomBytes(32);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function stringToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToString(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function wrapDEK(dek: string, kek: string): Promise<string> {
  const nonce = Crypto.getRandomBytes(12);
  const kekBytes = hexToBytes(kek);
  const dekBytes = hexToBytes(dek);
  
  const aesGcm = gcm(kekBytes, nonce);
  const ciphertext = aesGcm.encrypt(dekBytes);
  
  const wrappedData = {
    nonce: bytesToHex(nonce),
    ciphertext: bytesToHex(ciphertext),
  };
  
  return stringToBase64(JSON.stringify(wrappedData));
}

async function unwrapDEK(wrappedDEK: string, kek: string): Promise<string> {
  try {
    const wrappedData = JSON.parse(base64ToString(wrappedDEK));
    
    if (!wrappedData.nonce || !wrappedData.ciphertext) {
      throw new Error('Invalid wrapped DEK format');
    }
    
    const nonce = hexToBytes(wrappedData.nonce);
    const ciphertext = hexToBytes(wrappedData.ciphertext);
    const kekBytes = hexToBytes(kek);
    
    const aesGcm = gcm(kekBytes, nonce);
    const dekBytes = aesGcm.decrypt(ciphertext);
    
    return bytesToHex(dekBytes);
  } catch (error) {
    console.error('Failed to unwrap DEK:', error);
    throw new Error('Failed to unwrap DEK - corrupted data or wrong KEK');
  }
}

export async function initializeEncryption(): Promise<void> {
  if (dekCache) {
    return;
  }
  
  try {
    const mode = await getStoredEncryptionMode();
    const requireAuth = mode === 'protected';
    
    const wrappedDEK = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);

    if (!wrappedDEK) {
      const dek = generateRandomKey();
      const kek = generateRandomKey();
      
      const newWrappedDEK = await wrapDEK(dek, kek);
      
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, kek, {
        requireAuthentication: false,
      });
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, newWrappedDEK);
      await setStoredEncryptionMode('basic');
      
      dekCache = dek;
    } else {
      try {
        const kekValue = await SecureStore.getItemAsync(SECURE_STORE_KEYS.KEK, {
          requireAuthentication: requireAuth,
        });
        
        if (!kekValue) {
          console.error('[Encryption] KEK missing but wrapped DEK exists - corruption detected');
          throw new EncryptionError(
            ERROR_CODES.KEY_CORRUPTION,
            'Encryption keys are corrupted. Your data cannot be decrypted.'
          );
        }
        
        dekCache = await unwrapDEK(wrappedDEK, kekValue);
      } catch (error) {
        if (error instanceof EncryptionError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('canceled') || errorMessage.includes('cancelled') || 
            errorMessage.includes('Cancel')) {
          throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
        }
        
        if (errorMessage.includes('Authentication is already in progress') ||
            errorMessage.includes('already in progress')) {
          throw new EncryptionError(ERROR_CODES.AUTH_IN_PROGRESS, 'Authentication is in progress. Please try again.');
        }
        
        if (errorMessage.includes('Invalid wrapped DEK') || 
            errorMessage.includes('Failed to unwrap DEK') ||
            errorMessage.includes('corrupted')) {
          console.error('[Encryption] Key corruption detected');
          throw new EncryptionError(
            ERROR_CODES.KEY_CORRUPTION,
            'Encryption keys are corrupted. Your data cannot be decrypted.'
          );
        }
        
        throw error;
      }
    }
  } catch (error) {
    if (error instanceof EncryptionError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === 'USER_CANCELLED' || 
        errorMessage.includes('canceled') || 
        errorMessage.includes('cancelled') ||
        errorMessage.includes('Cancel')) {
      throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
    }
    
    if (errorMessage.includes('Authentication is already in progress') ||
        errorMessage.includes('already in progress')) {
      throw new EncryptionError(ERROR_CODES.AUTH_IN_PROGRESS, 'Authentication is in progress. Please try again.');
    }
    
    if (errorMessage.includes('not available') || 
        errorMessage.includes('SecureStore') ||
        errorMessage.includes('unavailable')) {
      console.error('[Encryption] SecureStore unavailable:', error);
      throw new EncryptionError(
        ERROR_CODES.SECURE_STORE_UNAVAILABLE,
        'Secure storage is not available on this device'
      );
    }
    
    console.error('Failed to initialize encryption:', error);
    throw new EncryptionError(
      ERROR_CODES.SECURE_STORE_UNAVAILABLE,
      'Failed to initialize encryption - secure storage may be unavailable'
    );
  }
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

export function getDEK(): string {
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

export async function reWrapKEK(requireAuth: boolean): Promise<void> {
  const TEMP_KEYS = {
    KEK: 'temp_kek',
    ENCRYPTED_DEK: 'temp_encrypted_dek',
    ENCRYPTION_MODE: 'temp_encryption_mode',
  };
  
  try {
    if (!dekCache) {
      throw new Error('DEK not initialized. Call initializeEncryption first.');
    }

    const currentMode = await getEncryptionMode();
    const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';

    if ((currentMode === 'protected') === requireAuth) {
      return;
    }

    const oldKEK = await SecureStore.getItemAsync(SECURE_STORE_KEYS.KEK, {
      requireAuthentication: currentMode === 'protected',
    });

    if (!oldKEK) {
      throw new Error('Failed to retrieve old KEK');
    }

    const wrappedDEK = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);
    if (!wrappedDEK) {
      throw new Error('Failed to retrieve wrapped DEK');
    }

    const dek = await unwrapDEK(wrappedDEK, oldKEK);

    const newKEK = generateRandomKey();
    const newWrappedDEK = await wrapDEK(dek, newKEK);

    await SecureStore.setItemAsync(TEMP_KEYS.KEK, newKEK, {
      requireAuthentication: false,
    });

    await SecureStore.setItemAsync(TEMP_KEYS.ENCRYPTED_DEK, newWrappedDEK);
    await SecureStore.setItemAsync(TEMP_KEYS.ENCRYPTION_MODE, newMode);

    const verifyKEK = await SecureStore.getItemAsync(TEMP_KEYS.KEK, {
      requireAuthentication: false,
    });
    const verifyWrappedDEK = await SecureStore.getItemAsync(TEMP_KEYS.ENCRYPTED_DEK);
    const verifyMode = await SecureStore.getItemAsync(TEMP_KEYS.ENCRYPTION_MODE);

    if (!verifyKEK || !verifyWrappedDEK || !verifyMode) {
      throw new Error('Failed to verify temporary key storage');
    }

    const verifiedDEK = await unwrapDEK(verifyWrappedDEK, verifyKEK);
    if (verifiedDEK !== dek) {
      throw new Error('Key verification failed - unwrapped DEK mismatch');
    }

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, newKEK, {
      requireAuthentication: requireAuth,
    });
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, newWrappedDEK);
    await setStoredEncryptionMode(newMode);

    await SecureStore.deleteItemAsync(TEMP_KEYS.KEK);
    await SecureStore.deleteItemAsync(TEMP_KEYS.ENCRYPTED_DEK);
    await SecureStore.deleteItemAsync(TEMP_KEYS.ENCRYPTION_MODE);

    dekCache = dek;
  } catch (error) {
    await SecureStore.deleteItemAsync(TEMP_KEYS.KEK).catch(() => {});
    await SecureStore.deleteItemAsync(TEMP_KEYS.ENCRYPTED_DEK).catch(() => {});
    await SecureStore.deleteItemAsync(TEMP_KEYS.ENCRYPTION_MODE).catch(() => {});
    
    if (error instanceof EncryptionError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('canceled') || errorMessage.includes('cancelled')) {
      throw new EncryptionError(ERROR_CODES.USER_CANCELLED, 'Authentication was cancelled');
    }

    console.error('[Encryption] Re-wrapping failed:', error);
    throw new EncryptionError(
      ERROR_CODES.REWRAP_FAILED,
      'Failed to re-wrap encryption key. Your data is still safe with the old settings.'
    );
  }
}

export function clearDEKCache(): void {
  dekCache = null;
}

export async function clearAllKeys(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.KEK);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ENCRYPTION_MODE);
    dekCache = null;
  } catch (error) {
    console.error('Error clearing keys:', error);
  }
}

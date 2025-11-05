import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const SECURE_STORE_KEYS = {
  DEK: 'database_encryption_key',
  AUTH_MODE: 'encryption_auth_mode',
};

export type EncryptionMode = 'basic' | 'protected';

let dekCache: string | null = null;

function generateRandomKey(): string {
  const randomBytes = Crypto.getRandomBytes(32);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function initializeEncryption(): Promise<void> {
  try {
    const authMode = await SecureStore.getItemAsync(SECURE_STORE_KEYS.AUTH_MODE);
    const requireAuth = authMode === 'protected';

    let dek = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEK, {
      requireAuthentication: requireAuth,
    });

    if (!dek) {
      dek = generateRandomKey();
      
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.DEK, dek, {
        requireAuthentication: false,
      });
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.AUTH_MODE, 'basic');
    }

    dekCache = dek;
  } catch (error) {
    console.error('Failed to initialize encryption:', error);
    throw new Error('Failed to initialize encryption keys');
  }
}

export function getDEK(): string {
  if (!dekCache) {
    throw new Error('DEK not initialized. Call initializeEncryption first.');
  }
  return dekCache;
}

export async function getEncryptionMode(): Promise<EncryptionMode> {
  return 'basic';
}

export function clearDEKCache(): void {
  dekCache = null;
}


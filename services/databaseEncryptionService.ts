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
  try {
    const authMode = await SecureStore.getItemAsync(SECURE_STORE_KEYS.AUTH_MODE);
    return authMode === 'protected' ? 'protected' : 'basic';
  } catch (error) {
    console.error('Error getting encryption mode:', error);
    return 'basic';
  }
}

export async function reWrapDEK(requireAuth: boolean): Promise<void> {
  try {
    if (!dekCache) {
      throw new Error('DEK not initialized. Call initializeEncryption first.');
    }

    const currentMode = await getEncryptionMode();
    const newMode: EncryptionMode = requireAuth ? 'protected' : 'basic';

    if ((currentMode === 'protected') === requireAuth) {
      console.log('[Encryption] Already in', newMode, 'mode, no re-wrapping needed');
      return;
    }

    console.log('[Encryption] Re-wrapping DEK:', currentMode, '→', newMode);

    const dekToSave = dekCache;

    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.DEK);

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.DEK, dekToSave, {
      requireAuthentication: requireAuth,
    });

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.AUTH_MODE, newMode);

    console.log('[Encryption] Re-wrapping complete, mode:', newMode);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('canceled') || errorMessage.includes('cancelled')) {
      console.log('[Encryption] User cancelled authentication, reverting...');
      throw new Error('USER_CANCELLED');
    }

    console.error('[Encryption] Re-wrapping failed:', error);
    throw new Error('Failed to re-wrap encryption key');
  }
}

export function clearDEKCache(): void {
  dekCache = null;
}


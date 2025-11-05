import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { gcm } from '@noble/ciphers/aes.js';

const SECURE_STORE_KEYS = {
  ENCRYPTED_DEK: 'encrypted_dek',
  KEK: 'kek',
  ENCRYPTION_MODE: 'encryption_mode',
};

export type EncryptionMode = 'basic' | 'protected';

let dekCache: string | null = null;
let onKeyMigrationCallback: (() => Promise<void>) | null = null;

export function setKeyMigrationCallback(callback: () => Promise<void>): void {
  onKeyMigrationCallback = callback;
}

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
  try {
    let kek = await SecureStore.getItemAsync(SECURE_STORE_KEYS.KEK);
    let wrappedDEK = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK);

    if (!kek || !wrappedDEK) {
      const dek = generateRandomKey();
      kek = generateRandomKey();
      
      wrappedDEK = await wrapDEK(dek, kek);
      
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, kek, {
        requireAuthentication: false,
      });
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, wrappedDEK);
      await setStoredEncryptionMode('basic');
      
      dekCache = dek;
    } else {
      try {
        const mode = await getStoredEncryptionMode();
        const requireAuth = mode === 'protected';
        
        const kekValue = await SecureStore.getItemAsync(SECURE_STORE_KEYS.KEK, {
          requireAuthentication: requireAuth,
        });
        
        if (!kekValue) {
          throw new Error('Failed to retrieve KEK');
        }
        
        dekCache = await unwrapDEK(wrappedDEK, kekValue);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('Invalid wrapped DEK') || 
            errorMessage.includes('Failed to unwrap DEK') ||
            errorMessage.includes('corrupted')) {
          console.warn('[Encryption] Old key format detected, migrating to new format...');
          
          if (onKeyMigrationCallback) {
            await onKeyMigrationCallback();
          }
          
          await clearAllKeys();
          
          const dek = generateRandomKey();
          const newKek = generateRandomKey();
          const newWrappedDEK = await wrapDEK(dek, newKek);
          
          await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, newKek, {
            requireAuthentication: false,
          });
          await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, newWrappedDEK);
          await setStoredEncryptionMode('basic');
          
          dekCache = dek;
          console.log('[Encryption] Migration complete - new keys generated');
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Failed to initialize encryption:', error);
    throw new Error('Failed to initialize encryption keys');
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

    console.log('[Encryption] Re-wrapping KEK:', currentMode, '→', newMode);

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

    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.KEK);

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.KEK, newKEK, {
      requireAuthentication: requireAuth,
    });

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.ENCRYPTED_DEK, newWrappedDEK);
    await setStoredEncryptionMode(newMode);

    dekCache = dek;

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
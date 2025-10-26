import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

const PIN_KEY = 'app_pin';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const LOCK_MODE_KEY = 'lock_mode';
const FAILED_ATTEMPTS_KEY = 'failed_pin_attempts';
const LOCKOUT_UNTIL_KEY = 'lockout_until';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const PROGRESSIVE_DELAYS_MS = [0, 1000, 5000, 15000, 30000]; // Progressive delays

type LockMode = 'none' | 'pin' | 'biometric';

export interface PinVerificationResult {
  success: boolean;
  isLockedOut: boolean;
  lockoutUntil?: number;
  remainingAttempts?: number;
  delayMs?: number;
}

export class AuthService {
  // Check if PIN is set
  static async isPinSet(): Promise<boolean> {
    try {
      const pin = await SecureStore.getItemAsync(PIN_KEY);
      return pin !== null;
    } catch (error) {
      console.error('Error checking if PIN is set:', error);
      return false;
    }
  }

  // Set PIN
  static async setPin(pin: string): Promise<boolean> {
    if (!/^[0-9]{4}$/.test(pin)) return false;
    
    let hash;
    try {
      hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `lunari_v1:${pin}`
      );
    } catch (error) {
      console.error('Error hashing PIN:', error);
      return false;
    }
    
    try {
      await SecureStore.setItemAsync(PIN_KEY, hash);
    } catch (error) {
      console.error('Error storing PIN:', error);
      return false;
    }
    
    try {
      await this.setLockMode('pin');
    } catch (error) {
      console.error('Error setting lock mode:', error);
      return false;
    }
    
    return true;
  }

  // Verify PIN with brute force protection
  static async verifyPin(pin: string): Promise<PinVerificationResult> {
    // Check if currently locked out
    let lockoutStatus;
    try {
      lockoutStatus = await this.checkLockoutStatus();
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return { success: false, isLockedOut: false };
    }
    
    if (lockoutStatus.isLockedOut) {
      return {
        success: false,
        isLockedOut: true,
        lockoutUntil: lockoutStatus.lockoutUntil,
      };
    }

    // Get current failed attempts
    let failedAttempts;
    try {
      failedAttempts = await this.getFailedAttempts();
    } catch (error) {
      console.error('Error getting failed attempts:', error);
      return { success: false, isLockedOut: false };
    }

    // Get stored PIN
    let storedPin;
    try {
      storedPin = await SecureStore.getItemAsync(PIN_KEY);
    } catch (error) {
      console.error('Error retrieving stored PIN:', error);
      return { success: false, isLockedOut: false };
    }
    
    if (!storedPin) {
      return { success: false, isLockedOut: false };
    }

    // Hash the input PIN
    let hash;
    try {
      hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `lunari_v1:${pin}`
      );
    } catch (error) {
      console.error('Error hashing PIN:', error);
      return { success: false, isLockedOut: false };
    }

    const isValid = storedPin === hash;

    if (isValid) {
      try {
        await this.resetFailedAttempts();
      } catch (error) {
        console.error('Error resetting failed attempts:', error);
        // Still return success since PIN was correct
      }
      return { success: true, isLockedOut: false };
    } else {
      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1;
      try {
        await this.incrementFailedAttempts();
      } catch (error) {
        console.error('Error incrementing failed attempts:', error);
        return { success: false, isLockedOut: false };
      }

      // Check if max attempts reached
      if (newFailedAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        try {
          await this.setLockoutUntil(lockoutUntil);
        } catch (error) {
          console.error('Error setting lockout:', error);
          return { success: false, isLockedOut: false };
        }
        
        return {
          success: false,
          isLockedOut: true,
          lockoutUntil,
          remainingAttempts: 0,
        };
      }

      const delayMs = this.getProgressiveDelay(newFailedAttempts);
      return {
        success: false,
        isLockedOut: false,
        remainingAttempts: MAX_ATTEMPTS - newFailedAttempts,
        delayMs,
      };
    }
  }


  // Remove PIN
  static async removePin(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(PIN_KEY);
    } catch (error) {
      console.error('Error deleting PIN:', error);
      return false;
    }
    
    try {
      await this.setLockMode('none');
    } catch (error) {
      console.error('Error setting lock mode:', error);
      return false;
    }
    
    return true;
  }

  // Biometric Authentication Methods
  static async isBiometricSupported(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      return compatible;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  }

  static async isBiometricEnrolled(): Promise<boolean> {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  }

  static async getBiometricType(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    try {
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Error getting biometric types:', error);
      return [];
    }
  }

  static async authenticateWithBiometric(
    disableDeviceFallback: boolean = false
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Lunari',
        cancelLabel: 'Cancel',
        disableDeviceFallback,
        requireConfirmation: false,
        fallbackLabel: disableDeviceFallback ? '' : 'Use device passcode',
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error:
            result.error === 'user_cancel'
              ? 'Authentication cancelled'
              : 'Authentication failed',
        };
      }
    } catch (error) {
      console.error('Error with biometric authentication:', error);
      return { success: false, error: 'Biometric authentication error' };
    }
  }

  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }

  static async setBiometricEnabled(enabled: boolean): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled.toString());
    } catch (error) {
      console.error('Error storing biometric enabled status:', error);
      return false;
    }
    
    try {
      if (enabled) {
        await this.setLockMode('biometric');
      } else {
        await this.setLockMode('none');
      }
    } catch (error) {
      console.error('Error setting lock mode:', error);
      return false;
    }
    
    return true;
  }

  static async canUseBiometric(): Promise<boolean> {
    const supported = await this.isBiometricSupported();
    const enrolled = await this.isBiometricEnrolled();
    const enabled = await this.isBiometricEnabled();

    return supported && enrolled && enabled;
  }

  static async getLockMode(): Promise<LockMode> {
    try {
      const mode = await SecureStore.getItemAsync(LOCK_MODE_KEY);
      return (mode as LockMode) || 'none';
    } catch (error) {
      console.error('Error getting lock mode:', error);
      return 'none';
    }
  }

  static async setLockMode(mode: LockMode): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(LOCK_MODE_KEY, mode);
      return true;
    } catch (error) {
      console.error('Error setting lock mode:', error);
      return false;
    }
  }

  static async isLockEnabled(): Promise<boolean> {
    const mode = await this.getLockMode();
    return mode !== 'none';
  }

  // Brute Force Protection Methods

  static async getFailedAttempts(): Promise<number> {
    try {
      const attempts = await SecureStore.getItemAsync(FAILED_ATTEMPTS_KEY);
      return attempts ? parseInt(attempts, 10) : 0;
    } catch (error) {
      console.error('Error getting failed attempts:', error);
      return 0;
    }
  }

  static async incrementFailedAttempts(): Promise<void> {
    try {
      const current = await this.getFailedAttempts();
      await SecureStore.setItemAsync(
        FAILED_ATTEMPTS_KEY,
        (current + 1).toString()
      );
    } catch (error) {
      console.error('Error incrementing failed attempts:', error);
    }
  }

  static async resetFailedAttempts(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(FAILED_ATTEMPTS_KEY);
    } catch (error) {
      console.error('Error deleting failed attempts:', error);
    }
    
    try {
      await SecureStore.deleteItemAsync(LOCKOUT_UNTIL_KEY);
    } catch (error) {
      console.error('Error deleting lockout until:', error);
    }
  }

  static async getLockoutUntil(): Promise<number | null> {
    try {
      const lockoutUntil = await SecureStore.getItemAsync(LOCKOUT_UNTIL_KEY);
      return lockoutUntil ? parseInt(lockoutUntil, 10) : null;
    } catch (error) {
      console.error('Error getting lockout until:', error);
      return null;
    }
  }

  static async setLockoutUntil(timestamp: number): Promise<void> {
    try {
      await SecureStore.setItemAsync(LOCKOUT_UNTIL_KEY, timestamp.toString());
    } catch (error) {
      console.error('Error setting lockout until:', error);
    }
  }

  static async checkLockoutStatus(): Promise<{
    isLockedOut: boolean;
    lockoutUntil?: number;
    remainingMs?: number;
  }> {
    let lockoutUntil;
    try {
      lockoutUntil = await this.getLockoutUntil();
    } catch (error) {
      console.error('Error getting lockout until:', error);
      return { isLockedOut: false };
    }
    
    if (!lockoutUntil) {
      return { isLockedOut: false };
    }

    const now = Date.now();
    const remainingMs = lockoutUntil - now;

    if (remainingMs > 0) {
      return {
        isLockedOut: true,
        lockoutUntil,
        remainingMs,
      };
    } else {
      // Lockout expired, reset attempts
      try {
        await this.resetFailedAttempts();
      } catch (error) {
        console.error('Error resetting failed attempts:', error);
        // Still return unlocked since lockout expired
      }
      return { isLockedOut: false };
    }
  }

  static getProgressiveDelay(attemptNumber: number): number {
    const index = Math.min(attemptNumber - 1, PROGRESSIVE_DELAYS_MS.length - 1);
    return PROGRESSIVE_DELAYS_MS[Math.max(0, index)];
  }
}
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
    try {
      if (!/^[0-9]{4}$/.test(pin)) return false;
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `lunari_v1:${pin}`
      );
      await SecureStore.setItemAsync(PIN_KEY, hash);
      await this.setLockMode('pin');
      return true;
    } catch (error) {
      console.error('Error setting PIN:', error);
      return false;
    }
  }

  // Verify PIN with brute force protection
  static async verifyPin(pin: string): Promise<PinVerificationResult> {
    try {
      // Check if currently locked out
      const lockoutStatus = await this.checkLockoutStatus();
      if (lockoutStatus.isLockedOut) {
        return {
          success: false,
          isLockedOut: true,
          lockoutUntil: lockoutStatus.lockoutUntil,
        };
      }

      // Get current failed attempts
      const failedAttempts = await this.getFailedAttempts();

      // Verify the PIN
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (!storedPin) {
        return { success: false, isLockedOut: false };
      }

      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `lunari_v1:${pin}`
      );

      const isValid = storedPin === hash;

      if (isValid) {
        // Reset failed attempts on successful verification
        await this.resetFailedAttempts();
        return { success: true, isLockedOut: false };
      } else {
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1;
        await this.incrementFailedAttempts();

        // Check if max attempts reached
        if (newFailedAttempts >= MAX_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
          await this.setLockoutUntil(lockoutUntil);
          return {
            success: false,
            isLockedOut: true,
            lockoutUntil,
            remainingAttempts: 0,
          };
        }

        // Calculate progressive delay
        const delayMs = this.getProgressiveDelay(newFailedAttempts);

        return {
          success: false,
          isLockedOut: false,
          remainingAttempts: MAX_ATTEMPTS - newFailedAttempts,
          delayMs,
        };
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return { success: false, isLockedOut: false };
    }
  }


  // Remove PIN
  static async removePin(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(PIN_KEY);
      await this.setLockMode('none');
      return true;
    } catch (error) {
      console.error('Error removing PIN:', error);
      return false;
    }
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
      if (enabled) {
        await this.setLockMode('biometric');
      } else {
        await this.setLockMode('none');
      }
      return true;
    } catch (error) {
      console.error('Error setting biometric enabled status:', error);
      return false;
    }
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
      await SecureStore.deleteItemAsync(LOCKOUT_UNTIL_KEY);
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
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
    try {
      const lockoutUntil = await this.getLockoutUntil();
      
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
        await this.resetFailedAttempts();
        return { isLockedOut: false };
      }
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return { isLockedOut: false };
    }
  }

  static getProgressiveDelay(attemptNumber: number): number {
    const index = Math.min(attemptNumber - 1, PROGRESSIVE_DELAYS_MS.length - 1);
    return PROGRESSIVE_DELAYS_MS[Math.max(0, index)];
  }
}
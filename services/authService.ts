import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

const PIN_KEY = 'app_pin';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const LOCK_MODE_KEY = 'lock_mode';

type LockMode = 'none' | 'pin' | 'biometric';

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

  // Verify PIN
  static async verifyPin(pin: string): Promise<boolean> {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (!storedPin) return false;
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `lunari_v1:${pin}`
      );
      return storedPin === hash;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
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
}

import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const LOCK_ENABLED_KEY = 'app_lock_enabled';

export class AuthService {
  static async isDeviceSecurityAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking device security:', error);
      return false;
    }
  }

  static async getDeviceSecurityType(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    try {
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Error getting device security types:', error);
      return [];
    }
  }

  static async authenticateWithDevice(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Lock Screen: full device auth for unlocking the app (allows OS PIN/passcode fallback)
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Lunari',
        // Allow OS fallback to device credentials when biometrics are unavailable
        // Android: PIN/pattern/password; iOS: device passcode
        disableDeviceFallback: false,
        requireConfirmation: false,
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
      console.error('Error with device authentication:', error);
      return { success: false, error: 'Authentication error' };
    }
  }

  static async authenticateForSettings(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Settings Toggle: lightweight identity confirmation for enabling lock (biometric only, cancellable)
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm biometric',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
        requireConfirmation: false,
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
      console.error('Error with settings authentication:', error);
      return { success: false, error: 'Authentication error' };
    }
  }

  static async isLockEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(LOCK_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking lock status:', error);
      return false;
    }
  }

  static async setLockEnabled(enabled: boolean): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(LOCK_ENABLED_KEY, enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting lock status:', error);
      return false;
    }
  }
}

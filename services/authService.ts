import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCK_ENABLED_KEY = 'app_lock_enabled';

export class AuthService {
  static async isDeviceSecurityAvailable(): Promise<boolean> {
    console.log('[AuthService] isDeviceSecurityAvailable called');
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('[AuthService] Device security:', { hasHardware, isEnrolled });
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('[AuthService] Error checking device security:', error);
      return false;
    }
  }

  static async getDeviceSecurityType(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    console.log('[AuthService] getDeviceSecurityType called');
    try {
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('[AuthService] Supported auth types:', types);
      return types;
    } catch (error) {
      console.error('[AuthService] Error getting device security types:', error);
      return [];
    }
  }

  static async isLockEnabled(): Promise<boolean> {
    console.log('[AuthService] isLockEnabled called');
    try {
      const enabled = await AsyncStorage.getItem(LOCK_ENABLED_KEY);
      console.log('[AuthService] Lock enabled status:', enabled);
      return enabled === 'true';
    } catch (error) {
      console.error('[AuthService] Error checking lock status:', error);
      return false;
    }
  }

  static async setLockEnabled(enabled: boolean): Promise<boolean> {
    console.log('[AuthService] setLockEnabled called', { enabled });
    try {
      await AsyncStorage.setItem(LOCK_ENABLED_KEY, enabled.toString());
      console.log('[AuthService] Lock status set successfully');
      return true;
    } catch (error) {
      console.error('[AuthService] Error setting lock status:', error);
      return false;
    }
  }
}

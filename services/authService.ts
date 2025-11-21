import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCK_ENABLED_KEY = 'app_lock_enabled';

export class AuthService {
  static async isDeviceSecurityAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('[AuthService] Error checking device security:', error);
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
      console.error('[AuthService] Error getting device security types:', error);
      return [];
    }
  }

  static async isLockEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(LOCK_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('[AuthService] Error checking lock status:', error);
      return false;
    }
  }

  static async setLockEnabled(enabled: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(LOCK_ENABLED_KEY, enabled.toString());
      return true;
    } catch (error) {
      console.error('[AuthService] Error setting lock status:', error);
      return false;
    }
  }
}

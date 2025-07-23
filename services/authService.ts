import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'app_pin';

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
      await SecureStore.setItemAsync(PIN_KEY, pin);
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
      return storedPin === pin;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  }

  // Remove PIN
  static async removePin(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(PIN_KEY);
      return true;
    } catch (error) {
      console.error('Error removing PIN:', error);
      return false;
    }
  }


} 
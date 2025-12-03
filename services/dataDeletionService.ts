import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteEncryptionKey } from './databaseEncryptionService';
import { deleteDatabaseFile, clearDatabaseCache, initializeDatabase } from '../db';

export class DataDeletionService {
  static async deleteAllUserData(): Promise<void> {
    try {
      // Delete encryption key from SecureStore + key_requires_auth from AsyncStorage
      await deleteEncryptionKey();

      // Delete entire database file (period.db)
      await deleteDatabaseFile();

      // Clear database cache
      await clearDatabaseCache();

      // Cancel all scheduled notifications
      await this.cancelAllNotifications();

      // Clear all AsyncStorage items (theme, notification settings, app lock, etc.)
      await AsyncStorage.clear();

      // Reinitialize database (creates fresh empty database with new encryption key)
      await initializeDatabase();
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  private static async cancelAllNotifications(): Promise<void> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      for (const notification of scheduledNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }
}

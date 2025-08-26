import * as Notifications from 'expo-notifications';
import { db } from '../db';
import { periodDates, healthLogs, settings } from '../db/schema';
import { eq, ne } from 'drizzle-orm';

export class DataDeletionService {
  static async deleteAllUserData(): Promise<void> {
    try {
      // Delete all period tracking data
      await db.delete(periodDates);
      
      // Delete all health logs (symptoms and mood data)
      await db.delete(healthLogs);
      
      // Delete only user content settings, preserve app setup/preferences
      const userContentSettingsToDelete = [
        'notifications_period_before',
        'notifications_period_day'
      ];
      
      for (const settingKey of userContentSettingsToDelete) {
        await db.delete(settings).where(eq(settings.key, settingKey));
      }
      
      // Cancel all scheduled notifications
      await this.cancelAllNotifications();
      
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  private static async cancelAllNotifications(): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  static async getDataSummary(): Promise<{
    periodEntries: number;
    healthLogs: number;
    settings: number;
  }> {
    try {
      const periodCount = await db.select().from(periodDates);
      const healthCount = await db.select().from(healthLogs);
      const settingsCount = await db.select().from(settings).where(
        ne(settings.key, 'theme')
      );

      return {
        periodEntries: periodCount.length,
        healthLogs: healthCount.length,
        settings: settingsCount.length,
      };
    } catch (error) {
      console.error('Error getting data summary:', error);
      return {
        periodEntries: 0,
        healthLogs: 0,
        settings: 0,
      };
    }
  }
}

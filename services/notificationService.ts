import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { PeriodPredictionService } from './periodPredictions';
import { getSetting, setSetting, db } from '../db';
import { periodDates } from '../db/schema';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // Check if notifications are enabled in settings
  static async areNotificationsEnabled(): Promise<boolean> {
    const beforePeriodEnabled = await getSetting('notifications_period_before');
    const dayOfPeriodEnabled = await getSetting('notifications_period_day');
    
    return beforePeriodEnabled === 'true' || dayOfPeriodEnabled === 'true';
  }
  
  // Check the status of specific notification types
  static async getNotificationSettings(): Promise<{
    beforePeriodEnabled: boolean;
    dayOfPeriodEnabled: boolean;
  }> {
    const beforePeriodEnabled = await getSetting('notifications_period_before') === 'true';
    const dayOfPeriodEnabled = await getSetting('notifications_period_day') === 'true';
    
    return {
      beforePeriodEnabled,
      dayOfPeriodEnabled
    };
  }
  
  // Save notification settings
  static async saveNotificationSettings(
    beforePeriodEnabled: boolean,
    dayOfPeriodEnabled: boolean
  ): Promise<void> {
    // Save settings to database
    await setSetting('notifications_period_before', beforePeriodEnabled ? 'true' : 'false');
    await setSetting('notifications_period_day', dayOfPeriodEnabled ? 'true' : 'false');
    
    // If notifications were just enabled, initialize them
    if (beforePeriodEnabled || dayOfPeriodEnabled) {
      await this.init();
      
      // Immediately schedule notifications if there's period data
      await this.scheduleNotificationsIfDataExists();
    } else {
      // If both are disabled, cancel all notifications
      await this.cancelPeriodNotifications();
    }
  }
  
  // Check notification permission status without requesting
  static async checkPermissionStatus(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use a physical device for notifications');
      return false;
    }
    
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }
  
  // Check if period data exists and schedule notifications if it does
  private static async scheduleNotificationsIfDataExists(): Promise<void> {
    try {
      // Get period dates from database
      const saved = await db.select().from(periodDates);
      
      if (saved.length > 0) {
        // Sort dates to find the most recent period
        const sortedDates = saved.map(s => s.date)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        
        // Group consecutive dates into periods
        const periods: string[][] = [];
        let currentPeriod: string[] = [sortedDates[0]];
  
        for (let i = 1; i < sortedDates.length; i++) {
          const dayDiff = Math.abs((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff <= 7) {
            currentPeriod.push(sortedDates[i]);
          } else {
            periods.push(currentPeriod);
            currentPeriod = [sortedDates[i]];
          }
        }
        periods.push(currentPeriod);
  
        // Find the start date of the most recent period
        if (periods.length > 0) {
          const mostRecentPeriod = periods[0];
          const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period
          
          // Schedule notifications based on this data
          await this.schedulePeriodReminder(mostRecentStart, sortedDates);
          console.log('Notifications scheduled immediately after enabling setting');
        }
      }
    } catch (error) {
      console.error('Error scheduling notifications after settings change:', error);
    }
  }
  
  // Initialize notification permissions and channel
  static async init() {
    // Check if notifications are enabled in settings
    const notificationsEnabled = await this.areNotificationsEnabled();
    
    // Only proceed if notifications are enabled
    if (!notificationsEnabled) {
      return;
    }
    
    // Set up notification channel for Android
    if (Platform.OS === 'android') {
      await this.setupNotificationChannel();
    }
    
    // Request permissions
    await this.requestPermissions();
  }
  
  // Set up Android notification channel
  private static async setupNotificationChannel() {
    await Notifications.setNotificationChannelAsync('period-notifications', {
      name: 'Period Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF597B',
      description: 'Notifications for period tracking and reminders',
    });
  }
  
  // Request notification permissions
  static async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Must use a physical device for notifications');
      return false;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions');
      return false;
    }
    
    return true;
  }
  
  // Schedule a notification for upcoming period
  static async schedulePeriodReminder(startDate: string, allDates: string[], daysBefore: number = 3) {
    // Check if notifications are enabled
    const { beforePeriodEnabled, dayOfPeriodEnabled } = await this.getNotificationSettings();
    
    if (!beforePeriodEnabled && !dayOfPeriodEnabled) {
      return;
    }
    
    // Cancel any existing period notifications first
    await this.cancelPeriodNotifications();
    
    // Get prediction for next period date
    const prediction = PeriodPredictionService.getPrediction(startDate, allDates);
    
    // Schedule before-period notification if enabled
    if (beforePeriodEnabled) {
      // Calculate the notification time - daysBefore days before the period
      const notificationDate = new Date(prediction.date);
      notificationDate.setDate(notificationDate.getDate() - daysBefore);
      
      // Don't schedule if the notification date is in the past
      if (notificationDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Period Reminder',
            body: `Your period is expected to start in ${daysBefore} days, on ${prediction.date}`,
            data: { type: 'period_reminder' },
            color: '#FF597B',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: Platform.OS === 'android' ? 'period-notifications' : undefined,
            date: notificationDate,
          },
          identifier: 'period-reminder',
        });
      }
    }
    
    // Schedule day-of notification if enabled
    if (dayOfPeriodEnabled) {
      const periodDate = new Date(prediction.date);
      
      // Don't schedule if the notification date is in the past
      if (periodDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Period Starting Today',
            body: `Your period is expected to start today based on your cycle history`,
            data: { type: 'period_start' },
            color: '#FF597B',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: Platform.OS === 'android' ? 'period-notifications' : undefined,
            date: periodDate,
          },
          identifier: 'period-start',
        });
      }
    }
  }
  
  // Cancel previously scheduled period notifications
  static async cancelPeriodNotifications() {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (
        notification.identifier === 'period-reminder' || 
        notification.identifier === 'period-start'
      ) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }
  
  // Schedule a test notification that appears immediately (for testing)
  static async scheduleTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification for the period tracking app',
        data: { type: 'test' },
      },
      trigger: null, // null trigger means the notification fires immediately
    });
  }
}
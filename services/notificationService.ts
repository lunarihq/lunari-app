import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { PeriodPredictionService } from './periodPredictions';
import { getSetting, setSetting, db } from '../db';
import { periodDates } from '../db/schema';
import { Colors } from '../styles/colors';
import i18n from '../i18n/config';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Newer SDKs also require these fields on iOS
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  // Check if notifications are enabled in settings
  static async areNotificationsEnabled(): Promise<boolean> {
    const beforePeriodEnabled = await getSetting('notifications_period_before');
    const dayOfPeriodEnabled = await getSetting('notifications_period_day');
    const latePeriodEnabled = await getSetting('notifications_period_late');

    return (
      beforePeriodEnabled === 'true' ||
      dayOfPeriodEnabled === 'true' ||
      latePeriodEnabled === 'true'
    );
  }

  // Check the status of specific notification types
  static async getNotificationSettings(): Promise<{
    beforePeriodEnabled: boolean;
    dayOfPeriodEnabled: boolean;
    latePeriodEnabled: boolean;
  }> {
    const beforePeriodEnabled =
      (await getSetting('notifications_period_before')) === 'true';
    const dayOfPeriodEnabled =
      (await getSetting('notifications_period_day')) === 'true';
    const latePeriodEnabled =
      (await getSetting('notifications_period_late')) === 'true';

    return {
      beforePeriodEnabled,
      dayOfPeriodEnabled,
      latePeriodEnabled,
    };
  }

  // Save notification settings
  static async saveNotificationSettings(
    beforePeriodEnabled: boolean,
    dayOfPeriodEnabled: boolean,
    latePeriodEnabled: boolean
  ): Promise<void> {
    // Save settings to database
    await setSetting(
      'notifications_period_before',
      beforePeriodEnabled ? 'true' : 'false'
    );
    await setSetting(
      'notifications_period_day',
      dayOfPeriodEnabled ? 'true' : 'false'
    );
    await setSetting(
      'notifications_period_late',
      latePeriodEnabled ? 'true' : 'false'
    );

    // If notifications were just enabled, initialize them
    if (beforePeriodEnabled || dayOfPeriodEnabled || latePeriodEnabled) {
      await this.init();

      // Immediately schedule notifications if there's period data
      await this.scheduleNotificationsIfDataExists();
    } else {
      // If all are disabled, cancel all notifications
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
        const sortedDates = saved.map(s => s.date);
        const periods =
          PeriodPredictionService.groupDateIntoPeriods(sortedDates);

        // Find the start date of the most recent period
        if (periods.length > 0) {
          const mostRecentPeriod = periods[0];
          const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period

          // Schedule notifications based on this data
          await this.schedulePeriodReminder(mostRecentStart, sortedDates);
          // scheduled
        }
      }
    } catch (error) {
      console.error(
        'Error scheduling notifications after settings change:',
        error
      );
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
      lightColor: Colors.accentPink,
      description: 'Notifications for period tracking and reminders',
    });
  }

  // Request notification permissions
  static async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Must use a physical device for notifications');
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
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
  static async schedulePeriodReminder(
    startDate: string,
    allDates: string[],
    daysBefore: number = 3
  ) {
    // Check if notifications are enabled
    const { beforePeriodEnabled, dayOfPeriodEnabled, latePeriodEnabled } =
      await this.getNotificationSettings();

    if (!beforePeriodEnabled && !dayOfPeriodEnabled && !latePeriodEnabled) {
      return;
    }

    // Cancel any existing period notifications first
    await this.cancelPeriodNotifications();

    // Load user cycle length setting
    const userCycleLengthSetting = await getSetting('userCycleLength');
    const userCycleLength = userCycleLengthSetting
      ? parseInt(userCycleLengthSetting, 10)
      : undefined;

    // Load user notification time preference (default to 9 AM)
    const notificationHour =
      (await getSetting('notification_time_hour')) || '9';
    const notificationMinute =
      (await getSetting('notification_time_minute')) || '0';

    // Get prediction for next period date (YYYY-MM-DD string)
    const prediction = PeriodPredictionService.getPrediction(
      startDate,
      allDates,
      userCycleLength
    );
    const [py, pm, pd] = prediction.date.split('-').map(Number);
    const predictionDateLocal = new Date(
      py,
      pm - 1,
      pd,
      parseInt(notificationHour),
      parseInt(notificationMinute),
      0
    );

    // Schedule before-period notification if enabled
    if (beforePeriodEnabled) {
      // Calculate the notification time - daysBefore days before the period
      const notificationDate = new Date(predictionDateLocal);
      notificationDate.setDate(notificationDate.getDate() - daysBefore);

      // Don't schedule if the notification date is in the past
      if (notificationDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notifications:periodReminder.title'),
            body: i18n.t('notifications:periodReminder.body', {
              days: daysBefore,
              date: prediction.date,
            }),
            data: { type: 'period_reminder' },
            color: Colors.accentPink,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId:
              Platform.OS === 'android' ? 'period-notifications' : undefined,
            date: notificationDate,
          },
          identifier: 'period-reminder',
        });
      }
    }

    // Schedule day-of notification if enabled
    if (dayOfPeriodEnabled) {
      const periodDate = new Date(predictionDateLocal);

      // Don't schedule if the notification date is in the past
      if (periodDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notifications:periodStarting.title'),
            body: i18n.t('notifications:periodStarting.body'),
            data: { type: 'period_start' },
            color: Colors.accentPink,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId:
              Platform.OS === 'android' ? 'period-notifications' : undefined,
            date: periodDate,
          },
          identifier: 'period-start',
        });
      }
    }

    // Schedule late period notification if enabled
    if (latePeriodEnabled) {
      const latePeriodDate = new Date(predictionDateLocal);
      latePeriodDate.setDate(latePeriodDate.getDate() + 1); // 1 day after expected period

      // Don't schedule if the notification date is in the past
      if (latePeriodDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notifications:periodLate.title'),
            body: i18n.t('notifications:periodLate.body'),
            data: { type: 'period_late' },
            color: Colors.accentPink,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId:
              Platform.OS === 'android' ? 'period-notifications' : undefined,
            date: latePeriodDate,
          },
          identifier: 'period-late',
        });
      }
    }
  }

  // Cancel previously scheduled period notifications
  static async cancelPeriodNotifications() {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (
        notification.identifier === 'period-reminder' ||
        notification.identifier === 'period-start' ||
        notification.identifier === 'period-late'
      ) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    }
  }

}

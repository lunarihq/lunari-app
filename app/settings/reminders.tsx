import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NotificationService } from '../../services/notificationService';
import { getSetting, setSetting } from '../../db';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';
export default function Reminders() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const [beforePeriodEnabled, setBeforePeriodEnabled] = useState(false);
  const [dayOfPeriodEnabled, setDayOfPeriodEnabled] = useState(false);
  const [latePeriodEnabled, setLatePeriodEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Load notification settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await NotificationService.getNotificationSettings();
        setBeforePeriodEnabled(settings.beforePeriodEnabled);
        setDayOfPeriodEnabled(settings.dayOfPeriodEnabled);
        setLatePeriodEnabled(settings.latePeriodEnabled);

        // Load notification time (default to 9 AM)
        const hour = (await getSetting('notification_time_hour')) || '9';
        const minute = (await getSetting('notification_time_minute')) || '0';
        const timeDate = new Date();
        timeDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
        setNotificationTime(timeDate);
      } catch (error) {
        console.error('Failed to load notification settings:', error);
        setStatusMessage({
          text: 'Could not load notification settings',
          isError: true,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Clear status message after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Show permission settings dialog
  const showPermissionSettingsDialog = () => {
    Alert.alert(
      'Enable Notifications',
      'To receive period reminders, please enable notifications for Lunari in your device settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };

  // Handle toggle for 3-day advance notification
  const toggleBeforePeriod = async (value: boolean) => {
    // If turning notifications off, no need to check permissions
    if (!value) {
      setBeforePeriodEnabled(value);
      await saveSettings(value, dayOfPeriodEnabled, latePeriodEnabled);
      return;
    }

    setIsSaving(true);
    try {
      // Check if we already have permissions
      let hasPermission = await NotificationService.checkPermissionStatus();

      // If no permission, request it
      if (!hasPermission) {
        hasPermission = await NotificationService.requestPermissions();
      }

      if (hasPermission) {
        // Only update UI and save setting if permission granted
        setBeforePeriodEnabled(value);
        await saveSettings(value, dayOfPeriodEnabled, latePeriodEnabled);
      } else {
        // Show settings dialog instead of error message
        showPermissionSettingsDialog();
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      setStatusMessage({
        text: 'Failed to update notification settings',
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggle for day-of notification
  const toggleDayOfPeriod = async (value: boolean) => {
    // If turning notifications off, no need to check permissions
    if (!value) {
      setDayOfPeriodEnabled(value);
      await saveSettings(beforePeriodEnabled, value, latePeriodEnabled);
      return;
    }

    setIsSaving(true);
    try {
      // Check if we already have permissions
      let hasPermission = await NotificationService.checkPermissionStatus();

      // If no permission, request it
      if (!hasPermission) {
        hasPermission = await NotificationService.requestPermissions();
      }

      if (hasPermission) {
        // Only update UI and save setting if permission granted
        setDayOfPeriodEnabled(value);
        await saveSettings(beforePeriodEnabled, value, latePeriodEnabled);
      } else {
        // Show settings dialog instead of error message
        showPermissionSettingsDialog();
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      setStatusMessage({
        text: 'Failed to update notification settings',
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggle for late period notification
  const toggleLatePeriod = async (value: boolean) => {
    // If turning notifications off, no need to check permissions
    if (!value) {
      setLatePeriodEnabled(value);
      await saveSettings(beforePeriodEnabled, dayOfPeriodEnabled, value);
      return;
    }

    setIsSaving(true);
    try {
      // Check if we already have permissions
      let hasPermission = await NotificationService.checkPermissionStatus();

      // If no permission, request it
      if (!hasPermission) {
        hasPermission = await NotificationService.requestPermissions();
      }

      if (hasPermission) {
        // Only update UI and save setting if permission granted
        setLatePeriodEnabled(value);
        await saveSettings(beforePeriodEnabled, dayOfPeriodEnabled, value);
      } else {
        // Show settings dialog instead of error message
        showPermissionSettingsDialog();
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      setStatusMessage({
        text: 'Failed to update notification settings',
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle time picker change
  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNotificationTime(selectedTime);
      // Save the time to database
      await setSetting(
        'notification_time_hour',
        selectedTime.getHours().toString()
      );
      await setSetting(
        'notification_time_minute',
        selectedTime.getMinutes().toString()
      );
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Save settings to database and update notification service
  const saveSettings = async (
    before: boolean,
    dayOf: boolean,
    late: boolean
  ) => {
    setIsSaving(true);
    try {
      await NotificationService.saveNotificationSettings(before, dayOf, late);

      // Removed notification success/disable messages
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      // Revert UI state if save fails
      const settings = await NotificationService.getNotificationSettings();
      setBeforePeriodEnabled(settings.beforePeriodEnabled);
      setDayOfPeriodEnabled(settings.dayOfPeriodEnabled);
      setLatePeriodEnabled(settings.latePeriodEnabled);

      setStatusMessage({
        text: 'Failed to update notification settings',
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.body, { marginTop: 16 }]}>
          Loading notification settings...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {statusMessage && (
        <View
          style={[
            styles.statusMessage,
            statusMessage.isError ? styles.errorMessage : styles.successMessage,
          ]}
        >
          <Text style={[typography.body, { textAlign: 'center' }]}>
            {statusMessage.text}
          </Text>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text
            style={[
              typography.body,
              { flexShrink: 1, paddingRight: 12, flex: 1 },
            ]}
          >
            Remind me 3 days before my next period is likely to start.
          </Text>
          <Switch
            value={beforePeriodEnabled}
            onValueChange={toggleBeforePeriod}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
            disabled={isSaving}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text
            style={[
              typography.body,
              { flexShrink: 1, paddingRight: 12, flex: 1 },
            ]}
          >
            Remind me the day of my period start.
          </Text>
          <Switch
            value={dayOfPeriodEnabled}
            onValueChange={toggleDayOfPeriod}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
            disabled={isSaving}
          />
        </View>

        <View style={[styles.settingRow, styles.lastRow]}>
          <Text
            style={[
              typography.body,
              { flexShrink: 1, paddingRight: 12, flex: 1 },
            ]}
          >
            Remind me if my period is late.
          </Text>
          <Switch
            value={latePeriodEnabled}
            onValueChange={toggleLatePeriod}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
            disabled={isSaving}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.settingRow, styles.lastRow]}
          onPress={() => setShowTimePicker(true)}
          disabled={isSaving}
        >
          <Text
            style={[
              typography.body,
              { flexShrink: 1, paddingRight: 12, flex: 1 },
            ]}
          >
            Reminder time
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.primary, fontWeight: '500' },
            ]}
          >
            {formatTime(notificationTime)}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          is24Hour={false}
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  statusMessage: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  successMessage: {
    backgroundColor: '#e7f7ed',
  },
  errorMessage: {
    backgroundColor: '#ffeded',
  },
});

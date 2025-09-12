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
} from 'react-native';
import { NotificationService } from '../services/notificationService';
import defaultTheme, { useTheme } from '../styles/theme';
export default function Reminders() {
  const { colors } = useTheme();
  const [beforePeriodEnabled, setBeforePeriodEnabled] = useState(false);
  const [dayOfPeriodEnabled, setDayOfPeriodEnabled] = useState(false);
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
      await saveSettings(value, dayOfPeriodEnabled);
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
        await saveSettings(value, dayOfPeriodEnabled);
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
      await saveSettings(beforePeriodEnabled, value);
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
        await saveSettings(beforePeriodEnabled, value);
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

  // Save settings to database and update notification service
  const saveSettings = async (before: boolean, dayOf: boolean) => {
    setIsSaving(true);
    try {
      await NotificationService.saveNotificationSettings(before, dayOf);

      // Removed notification success/disable messages
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      // Revert UI state if save fails
      const settings = await NotificationService.getNotificationSettings();
      setBeforePeriodEnabled(settings.beforePeriodEnabled);
      setDayOfPeriodEnabled(settings.dayOfPeriodEnabled);

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
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
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
          <Text style={[styles.statusText, { color: colors.textPrimary }]}>
            {statusMessage.text}
          </Text>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
            Get a notification 3 days before your next period is likely to
            start.
          </Text>
          <Switch
            value={beforePeriodEnabled}
            onValueChange={toggleBeforePeriod}
            trackColor={{ false: colors.border, true: colors.accentPink }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
            disabled={isSaving}
          />
        </View>

        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
            Get a notification the day of your period start.
          </Text>
          <Switch
            value={dayOfPeriodEnabled}
            onValueChange={toggleDayOfPeriod}
            trackColor={{ false: colors.border, true: colors.accentPink }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
            disabled={isSaving}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  settingText: {
    fontSize: 16,
    flexShrink: 1,
    paddingRight: 12,
    flex: 1,
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
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

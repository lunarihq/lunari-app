import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { NotificationService } from '../../services/notificationService';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const [beforePeriodEnabled, setBeforePeriodEnabled] = useState(false);
  const [dayOfPeriodEnabled, setDayOfPeriodEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{text: string, isError: boolean} | null>(null);

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
          isError: true
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

  // Handle toggle for 3-day advance notification
  const toggleBeforePeriod = async (value: boolean) => {
    setBeforePeriodEnabled(value);
    await saveSettings(value, dayOfPeriodEnabled);
  };

  // Handle toggle for day-of notification
  const toggleDayOfPeriod = async (value: boolean) => {
    setDayOfPeriodEnabled(value);
    await saveSettings(beforePeriodEnabled, value);
  };

  // Save settings to database and update notification service
  const saveSettings = async (before: boolean, dayOf: boolean) => {
    setIsSaving(true);
    try {
      await NotificationService.saveNotificationSettings(before, dayOf);
      
      if (before || dayOf) {
        setStatusMessage({
          text: 'Notifications enabled successfully',
          isError: false
        });
      } else {
        setStatusMessage({
          text: 'Notifications disabled',
          isError: false
        });
      }
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      // Revert UI state if save fails
      const settings = await NotificationService.getNotificationSettings();
      setBeforePeriodEnabled(settings.beforePeriodEnabled);
      setDayOfPeriodEnabled(settings.dayOfPeriodEnabled);
      
      setStatusMessage({
        text: 'Failed to update notification settings',
        isError: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF597B" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      

      <ScrollView style={styles.content}>
        {statusMessage && (
          <View style={[
            styles.statusMessage, 
            statusMessage.isError ? styles.errorMessage : styles.successMessage
          ]}>
            <Text style={styles.statusText}>{statusMessage.text}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>
              Get a notification 3 days before your next period is likely to start.
            </Text>
            <Switch
              value={beforePeriodEnabled}
              onValueChange={toggleBeforePeriod}
              trackColor={{ false: '#e0e0e0', true: '#FF597B' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#ffffff'}
              ios_backgroundColor="#e0e0e0"
              disabled={isSaving}
            />
          </View>
          
          <View style={[styles.settingRow, styles.lastRow]}>
            <Text style={styles.settingText}>
              Get a notification the day of your period start.
            </Text>
            <Switch
              value={dayOfPeriodEnabled}
              onValueChange={toggleDayOfPeriod}
              trackColor={{ false: '#e0e0e0', true: '#FF597B' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#ffffff'}
              ios_backgroundColor="#e0e0e0"
              disabled={isSaving}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F3F2F7',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
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
    color: '#333',
  },
});

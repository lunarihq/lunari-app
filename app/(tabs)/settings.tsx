import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';
import { ThemeSelectionModal } from '../../components/ThemeSelectionModal';
import { DataDeletionService } from '../../services/dataDeletionService';
import { NotificationService } from '../../services/notificationService';
import { useNotes } from '../../contexts/NotesContext';

export default function Settings() {
  const router = useRouter();
  const { colors, themeMode } = useTheme();
  const typography = createTypography(colors);
  const { clearNotes } = useNotes();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={async () => {
            await NotificationService.scheduleTestNotification();
            Alert.alert('Test Notification', 'A test notification has been scheduled!');
          }}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[typography.body, { fontSize: 18, flex: 1 }]}>
            Test Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings/reminders')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="alarm-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[typography.body, { fontSize: 18, flex: 1 }]}>
            Reminders
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings/app-lock')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[typography.body, { fontSize: 18, flex: 1 }]}>
            App lock
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings/privacy-policy')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[typography.body, { fontSize: 18, flex: 1 }]}>
            Privacy policy
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings/about')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[typography.body, { fontSize: 18, flex: 1 }]}>
            About
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={() => setThemeModalVisible(true)}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="color-palette-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[typography.body, { fontSize: 18, flex: 1 }]}>
            Theme
          </Text>
          <Text style={[typography.body, { color: colors.textMuted }]}>
            {themeMode === 'system'
              ? 'System default'
              : themeMode === 'light'
                ? 'Light'
                : 'Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.settingRow, styles.lastRow]}
          onPress={() => {
            Alert.alert(
              'Delete Tracking Data',
              'This action cannot be undone. All your period tracking data, symptoms, and notification preferences will be permanently deleted. Your app settings and preferences will be preserved.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete all data',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await DataDeletionService.deleteAllUserData();
                      clearNotes();

                      // Notify all components that data was deleted
                      DeviceEventEmitter.emit('dataDeleted');

                      Alert.alert('Success', 'All your data has been deleted.');
                    } catch {
                      Alert.alert(
                        'Error',
                        'Failed to delete data. Please try again.'
                      );
                    }
                  },
                },
              ]
            );
          }}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </View>
          <Text
            style={[
              typography.body,
              { fontSize: 18, flex: 1, color: colors.error },
            ]}
          >
            Delete tracking data
          </Text>
          <Ionicons name="chevron-forward" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ThemeSelectionModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    marginRight: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});

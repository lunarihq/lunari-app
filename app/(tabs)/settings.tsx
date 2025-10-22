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
import { useTranslation } from 'react-i18next';
import { useTheme, createTypography } from '../../styles/theme';
import { commonStyles } from '../../styles/commonStyles';
import { ThemeSelectionModal } from '../../components/ThemeSelectionModal';
import { DataDeletionService } from '../../services/dataDeletionService';
import { useNotes } from '../../contexts/NotesContext';

export default function Settings() {
  const router = useRouter();
  const { colors, themeMode } = useTheme();
  const typography = createTypography(colors);
  const { clearNotes } = useNotes();
  const { t } = useTranslation('settings');
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  return (
    <ScrollView
      style={[commonStyles.scrollView]}
      contentContainerStyle={commonStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
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
          <Text style={[typography.body, { flex: 1 }]}>
            {t('reminders')}
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
          <Text style={[typography.body, { flex: 1 }]}>
            {t('appLock')}
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
          <Text style={[typography.body, { flex: 1 }]}>
            {t('privacyPolicy')}
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
          <Text style={[typography.body, { flex: 1 }]}>
            {t('about')}
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
          <Text style={[typography.body, { flex: 1 }]}>
            {t('theme')}
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {themeMode === 'system'
              ? t('themeOptions.system')
              : themeMode === 'light'
                ? t('themeOptions.light')
                : t('themeOptions.dark')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <TouchableOpacity
          style={[styles.settingRow, styles.lastRow]}
          onPress={() => {
            Alert.alert(
              t('deleteDataConfirm.title'),
              t('deleteDataConfirm.message'),
              [
                { text: t('deleteDataConfirm.cancel'), style: 'cancel' },
                {
                  text: t('deleteDataConfirm.delete'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await DataDeletionService.deleteAllUserData();
                      clearNotes();

                      DeviceEventEmitter.emit('dataDeleted');

                      Alert.alert(
                        t('deleteDataConfirm.success'),
                        t('deleteDataConfirm.successMessage')
                      );
                    } catch {
                      Alert.alert(
                        t('deleteDataConfirm.error'),
                        t('deleteDataConfirm.errorMessage')
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
              { flex: 1, color: colors.error },
            ]}
          >
            {t('deleteData')}
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

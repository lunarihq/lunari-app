import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import defaultTheme, { useTheme } from '../styles/theme';
import { ThemeSelectionModal } from '../../components/ThemeSelectionModal';

export default function Settings() {
  const router = useRouter();
  const { colors, themeMode } = useTheme();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/reminders')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="alarm-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
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
          onPress={() => router.push('/app-lock')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
            App Lock
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { borderBottomColor: colors.border }]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
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
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
            About
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, styles.lastRow]}
          onPress={() => setThemeModalVisible(true)}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="color-palette-outline"
              size={24}
              color={colors.textPrimary}
            />
          </View>
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
            Theme
          </Text>
          <Text style={[styles.currentValue, { color: colors.textMuted }]}>
            {themeMode === 'system' ? 'System default' : 
             themeMode === 'light' ? 'Light' : 'Dark'}
          </Text>
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
    marginVertical: 16,
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
  settingText: {
    fontSize: 18,
    flex: 1,
  },
  currentValue: {
    fontSize: 16,
    color: '#666',
  },
});

import React from 'react';
import { View, Text, StyleSheet, Switch, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';

export default function AppLockScreen() {
  const { colors } = useTheme();
  const { commonStyles } = useAppStyles();
  const { t } = useTranslation('settings');
  const {
    isLockEnabled,
    isDeviceSecurityAvailable,
    isReWrapping,
    setLockEnabled,
  } = useAuth();

  const handleToggle = async (value: boolean) => {
    // No need to check device security here - the toggle is disabled when unavailable
    const result = await setLockEnabled(value);
    if (result.cancelled) {
      return;
    }
    if (result.error) {
      Alert.alert(
        t('appLockSettings.error.title'),
        result.error
      );
    }
  };

  return (
    <View style={[commonStyles.container]}>
      <View style={[commonStyles.sectionContainer, { padding: 0 }]}>
        <View style={[styles.settingRow]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              {t('appLockSettings.unlockApp')}
            </Text>
            <Text
              style={[styles.settingSubtitle, { color: colors.textSecondary }]}
            >
              {isDeviceSecurityAvailable
                ? t('appLockSettings.unlockDescription')
                : t('appLockSettings.noDeviceSecurityDescription')}
            </Text>
          </View>
          {isReWrapping ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Switch
              value={isLockEnabled}
              onValueChange={handleToggle}
              disabled={!isDeviceSecurityAvailable}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});

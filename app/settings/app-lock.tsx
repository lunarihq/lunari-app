import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
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
    setLockEnabled,
    authenticateForSettings,
  } = useAuth();

  const [lockEnabledState, setLockEnabledState] = useState(false);
  const [deviceSecurityAvailable, setDeviceSecurityAvailable] = useState(false);

  useEffect(() => {
    setLockEnabledState(isLockEnabled);
    setDeviceSecurityAvailable(isDeviceSecurityAvailable);
  }, [isLockEnabled, isDeviceSecurityAvailable]);

  const handleToggle = async (value: boolean) => {
    if (value && !deviceSecurityAvailable) {
      Alert.alert(
        t('appLockSettings.noDeviceSecurity.title'),
        t('appLockSettings.noDeviceSecurity.message'),
        [{ text: t('appLockSettings.noDeviceSecurity.ok') }]
      );
      return;
    }

    if (value) {
      // Settings Toggle: confirm identity via biometric before enabling lock
      const authResult = await authenticateForSettings();
      if (!authResult) {
        return;
      }
    }

    const success = await setLockEnabled(value);
    if (success) {
      setLockEnabledState(value);
    } else {
      Alert.alert(
        t('appLockSettings.error.title'),
        t('appLockSettings.error.message')
      );
    }
  };

  return (
    <View style={[commonStyles.container]}>
      <View style={[commonStyles.sectionContainer, { padding: 0 }]}>
        <View style={[styles.settingRow, styles.lastRow]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              {t('appLockSettings.unlockApp')}
            </Text>
            <Text
              style={[styles.settingSubtitle, { color: colors.textSecondary }]}
            >
              {deviceSecurityAvailable
                ? t('appLockSettings.unlockDescription')
                : t('appLockSettings.noDeviceSecurityDescription')}
            </Text>
          </View>
          <Switch
            value={lockEnabledState}
            onValueChange={handleToggle}
            disabled={!deviceSecurityAvailable}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.border}
          />
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
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
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

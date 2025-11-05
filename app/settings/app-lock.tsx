import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';
import { getEncryptionMode, EncryptionMode } from '../../services/databaseEncryptionService';

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

  const [lockEnabledState, setLockEnabledState] = useState(false);
  const [deviceSecurityAvailable, setDeviceSecurityAvailable] = useState(false);
  const [encryptionMode, setEncryptionMode] = useState<EncryptionMode>('basic');

  useEffect(() => {
    setLockEnabledState(isLockEnabled);
    setDeviceSecurityAvailable(isDeviceSecurityAvailable);
    
    const loadEncryptionMode = async () => {
      const mode = await getEncryptionMode();
      setEncryptionMode(mode);
    };
    loadEncryptionMode();
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

    const success = await setLockEnabled(value);
    if (success) {
      setLockEnabledState(value);
      const newMode = await getEncryptionMode();
      setEncryptionMode(newMode);
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
        <View style={[styles.settingRow]}>
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
          {isReWrapping ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Switch
              value={lockEnabledState}
              onValueChange={handleToggle}
              disabled={!deviceSecurityAvailable}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          )}
        </View>

        <View style={[styles.settingRow, styles.lastRow]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              Database Encryption
            </Text>
            <Text
              style={[styles.settingSubtitle, { color: colors.textSecondary }]}
            >
              {encryptionMode === 'protected'
                ? 'Device-Protected Encryption (hardware-backed)'
                : 'Basic Encryption (OS-level only)'}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: encryptionMode === 'protected' ? colors.success : colors.neutral300 }]}>
            <Text style={[styles.badgeText, { color: encryptionMode === 'protected' ? colors.white : colors.textSecondary }]}>
              {encryptionMode === 'protected' ? '🔒 Protected' : 'Basic'}
            </Text>
          </View>
        </View>
      </View>

      {lockEnabledState && (
        <View style={[commonStyles.sectionContainer, { paddingHorizontal: 16 }]}>
          <Text style={[styles.warningText, { color: colors.warning }]}>
            ⚠️ Warning: If you forget your device PIN/biometric authentication, you will lose access to all data permanently.
          </Text>
        </View>
      )}
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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

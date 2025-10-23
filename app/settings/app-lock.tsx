import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';
export default function AppLockScreen() {
  const { colors } = useTheme();
  const { commonStyles } = useAppStyles();
  const { t } = useTranslation('settings');
  const {
    isPinSet,
    removePin,
    refreshPinStatus,
    setBiometricEnabled,
    getBiometricType,
    lockMode,
  } = useAuth();

  const [pinEnabled, setPinEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    setPinEnabled(isPinSet);
    setBiometricEnabledState(lockMode === 'biometric');

    const checkBiometricSupport = async () => {
      const { AuthService } = await import('../../services/authService');
      const supported = await AuthService.isBiometricSupported();
      const enrolled = await AuthService.isBiometricEnrolled();
      setBiometricSupported(supported && enrolled);

      if (supported && enrolled) {
        const type = await getBiometricType();
        setBiometricType(type);
      }
    };

    checkBiometricSupport();
  }, [isPinSet, lockMode, getBiometricType]);

  const handlePinToggle = async (value: boolean) => {
    if (value) {
      if (biometricEnabled) {
        Alert.alert(
          t('appLockSettings.removeBiometricFirst.title'),
          t('appLockSettings.removeBiometricFirst.message'),
          [{ text: t('appLockSettings.removeBiometricFirst.ok') }]
        );
        return;
      }
      router.push('/settings/pin-setup?mode=setup');
    } else {
      Alert.alert(
        t('appLockSettings.removePinConfirm.title'),
        t('appLockSettings.removePinConfirm.message'),
        [
          {
            text: t('appLockSettings.removePinConfirm.cancel'),
            style: 'cancel',
          },
          {
            text: t('appLockSettings.removePinConfirm.remove'),
            style: 'destructive',
            onPress: async () => {
              const success = await removePin();
              if (success) {
                setPinEnabled(false);
                await refreshPinStatus();
              } else {
                Alert.alert(
                  t('appLockSettings.removePinError.title'),
                  t('appLockSettings.removePinError.message')
                );
              }
            },
          },
        ]
      );
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value && isPinSet) {
      Alert.alert(
        t('appLockSettings.removePinFirst.title'),
        t('appLockSettings.removePinFirst.message'),
        [{ text: t('appLockSettings.removePinFirst.ok') }]
      );
      return;
    }

    if (value) {
      const success = await setBiometricEnabled(true);
      if (success) {
        setBiometricEnabledState(true);
        await refreshPinStatus();
      } else {
        Alert.alert(
          t('appLockSettings.biometricEnableError.title'),
          t('appLockSettings.biometricEnableError.message')
        );
      }
    } else {
      const success = await setBiometricEnabled(false);
      if (success) {
        setBiometricEnabledState(false);
        await refreshPinStatus();
      } else {
        Alert.alert(
          t('appLockSettings.biometricDisableError.title'),
          t('appLockSettings.biometricDisableError.message')
        );
      }
    }
  };

  return (
    <View
      style={[
        commonStyles.container,
      ]}
    >
      <View style={[commonStyles.sectionContainer, { padding: 0 }]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              {t('appLockSettings.pin')}
            </Text>
            <Text
              style={[styles.settingSubtitle, { color: colors.textSecondary }]}
            >
              {t('appLockSettings.pinDescription')}
            </Text>
          </View>
          <Switch
            value={pinEnabled}
            onValueChange={handlePinToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.border}
          />
        </View>

        {isPinSet && (
          <TouchableOpacity
            style={[styles.settingRow, styles.lastRow]}
            onPress={() => router.push('/settings/pin-setup?mode=change')}
          >
            <View style={styles.settingContent}>
              <Text
                style={[styles.settingTitle, { color: colors.textPrimary }]}
              >
                {t('appLockSettings.changePin')}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {biometricSupported && (
        <View style={[commonStyles.sectionContainer, { padding: 0 }]}>
          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={styles.settingContent}>
              <Text
                style={[styles.settingTitle, { color: colors.textPrimary }]}
              >
                {t('appLockSettings.biometricAuth')}{' '}
                {biometricType ? `(${biometricType})` : ''}
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {t('appLockSettings.biometricDescription')}
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import defaultTheme, { useTheme } from '../../styles/theme';

export default function AppLockScreen() {
  const { colors } = useTheme();
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
          'Remove Biometric First',
          'You currently have biometric authentication enabled. Please disable it before enabling PIN.',
          [{ text: 'OK' }]
        );
        return;
      }
      router.push('/settings/pin-setup?mode=setup');
    } else {
      Alert.alert('Remove PIN', 'Are you sure you want to remove your PIN?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removePin();
            if (success) {
              setPinEnabled(false);
              await refreshPinStatus();
            } else {
              Alert.alert('Error', 'Failed to remove PIN. Please try again.');
            }
          },
        },
      ]);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value && isPinSet) {
      Alert.alert(
        'Remove PIN First',
        'You currently have PIN enabled. Please disable PIN before enabling biometric authentication.',
        [{ text: 'OK' }]
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
          'Error',
          'Failed to enable biometric lock. Please try again.'
        );
      }
    } else {
      const success = await setBiometricEnabled(false);
      if (success) {
        setBiometricEnabledState(false);
        await refreshPinStatus();
      } else {
        Alert.alert(
          'Error',
          'Failed to disable biometric lock. Please try again.'
        );
      }
    }
  };

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
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
              PIN
            </Text>
            <Text
              style={[styles.settingSubtitle, { color: colors.textSecondary }]}
            >
              Set up a PIN to unlock the app
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
                Change PIN
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
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={styles.settingContent}>
              <Text
                style={[styles.settingTitle, { color: colors.textPrimary }]}
              >
                Biometric authentication{' '}
                {biometricType ? `(${biometricType})` : ''}
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Use device biometrics to unlock the app.
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
    </ScrollView>
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

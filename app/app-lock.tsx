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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../styles/theme';

export default function AppLockScreen() {
  const { colors } = useTheme();
  const {
    isPinSet,
    removePin,
    refreshPinStatus,
    canUseBiometric,
    setBiometricEnabled,
    getBiometricType,
  } = useAuth();

  const [pinEnabled, setPinEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    setPinEnabled(isPinSet);
    setBiometricEnabledState(canUseBiometric);

    const checkBiometricSupport = async () => {
      if (isPinSet) {
        const { AuthService } = await import('../services/authService');
        const supported = await AuthService.isBiometricSupported();
        const enrolled = await AuthService.isBiometricEnrolled();
        setBiometricSupported(supported && enrolled);

        if (supported && enrolled) {
          const type = await getBiometricType();
          setBiometricType(type);
        }
      }
    };

    checkBiometricSupport();
  }, [isPinSet, canUseBiometric, getBiometricType]);

  const handlePinToggle = async (value: boolean) => {
    if (value) {
      // Navigate to PIN setup
      router.push('/pin-setup?mode=setup');
    } else {
      // Show confirmation dialog
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
    const success = await setBiometricEnabled(value);
    if (success) {
      setBiometricEnabledState(value);
    } else {
      Alert.alert(
        'Error',
        'Failed to update biometric settings. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingContent}>
              <Text
                style={[styles.settingTitle, { color: colors.textPrimary }]}
              >
                Set up a PIN
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
              onPress={() => router.push('/pin-setup?mode=change')}
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
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {isPinSet && biometricSupported && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={[styles.settingRow, styles.lastRow]}>
              <View style={styles.settingContent}>
                <Text
                  style={[styles.settingTitle, { color: colors.textPrimary }]}
                >
                  Use {biometricType}
                </Text>
                <Text
                  style={[styles.settingSubtitle, { color: colors.textMuted }]}
                >
                  Unlock app with {biometricType.toLowerCase()} instead of PIN
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

        {isPinSet && (
          <View style={styles.infoSection}>
            <View
              style={[styles.infoContainer, { backgroundColor: colors.panel }]}
            >
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.textMuted}
                style={styles.infoIcon}
              />
              <Text style={[styles.infoText, { color: colors.textMuted }]}>
                When app lock is enabled, you'll need to authenticate when the
                app starts or returns from the background.
                {biometricSupported &&
                  biometricEnabled &&
                  ` You can use your ${biometricType.toLowerCase()} or PIN to unlock.`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
    borderBottomWidth: 0.5,
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
  infoSection: {
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

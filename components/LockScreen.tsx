import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PinInput } from './PinInput';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../styles/theme';

export function LockScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('settings');
  const { verifyPin, authenticateWithBiometric, lockMode } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [biometricAttempted, setBiometricAttempted] = useState(false);

  const handleBiometricAuth = useCallback(async () => {
    try {
      const success = await authenticateWithBiometric();
      if (!success) {
        // Biometric failed with device fallback enabled, so this is final
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  }, [authenticateWithBiometric]);

  // Automatically attempt biometric authentication when screen loads
  useEffect(() => {
    if (lockMode === 'biometric' && !biometricAttempted) {
      setBiometricAttempted(true);
      handleBiometricAuth();
    }
  }, [lockMode, biometricAttempted, handleBiometricAuth]);

  const handlePinComplete = async (pin: string) => {
    const isValid = await verifyPin(pin);

    if (!isValid) {
      setErrorMessage(t('lockScreen.incorrectPin'));
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleStartTyping = () => {
    setErrorMessage('');
    // Reset biometric attempt so user can try biometric again after typing PIN
    setBiometricAttempted(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {lockMode === 'pin' && (
          <PinInput
            title={t('lockScreen.enterPin')}
            subtitle={t('lockScreen.enterPinSubtitle')}
            onPinComplete={handlePinComplete}
            errorMessage={errorMessage}
            onStartTyping={handleStartTyping}
          />
        )}
        {lockMode === 'biometric' && (
          <View style={styles.biometricContainer}>
            <Text style={[styles.biometricTitle, { color: colors.textPrimary }]}>
              {t('lockScreen.unlockApp')}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  biometricContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  biometricTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
});

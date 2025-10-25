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
  const { verifyPin, authenticateWithBiometric, lockMode, checkLockoutStatus } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState('');
  const [isPinDisabled, setIsPinDisabled] = useState(false);

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

  // Check lockout status on mount and set up countdown timer
  useEffect(() => {
    const checkLockout = async () => {
      const status = await checkLockoutStatus();
      if (status.isLockedOut && status.lockoutUntil) {
        setIsLockedOut(true);
        setLockoutUntil(status.lockoutUntil);
      }
    };
    checkLockout();
  }, [checkLockoutStatus]);

  // Update countdown timer
  useEffect(() => {
    if (!isLockedOut || !lockoutUntil) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = lockoutUntil - now;

      if (remaining <= 0) {
        setIsLockedOut(false);
        setLockoutUntil(null);
        setRemainingTime('');
        setErrorMessage('');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut, lockoutUntil]);

  // Automatically attempt biometric authentication when screen loads
  useEffect(() => {
    if (lockMode === 'biometric' && !biometricAttempted) {
      setBiometricAttempted(true);
      handleBiometricAuth();
    }
  }, [lockMode, biometricAttempted, handleBiometricAuth]);

  const handlePinComplete = async (pin: string) => {
    if (isPinDisabled || isLockedOut) return;

    const result = await verifyPin(pin);

    if (result.isLockedOut && result.lockoutUntil) {
      setIsLockedOut(true);
      setLockoutUntil(result.lockoutUntil);
      setErrorMessage(t('lockScreen.tooManyAttempts'));
    } else if (!result.success) {
      const attemptsMsg = result.remainingAttempts
        ? t('lockScreen.incorrectPinWithAttempts', {
            attempts: result.remainingAttempts,
          })
        : t('lockScreen.incorrectPin');
      
      setErrorMessage(attemptsMsg);

      // Apply progressive delay
      if (result.delayMs && result.delayMs > 0) {
        setIsPinDisabled(true);
        setTimeout(() => {
          setIsPinDisabled(false);
          setErrorMessage('');
        }, result.delayMs);
      } else {
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleStartTyping = () => {
    if (!isPinDisabled && !isLockedOut) {
      setErrorMessage('');
      setBiometricAttempted(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {lockMode === 'pin' && (
          <>
            {isLockedOut ? (
              <View style={styles.lockoutContainer}>
                <Text style={[styles.lockoutTitle, { color: colors.error }]}>
                  {t('lockScreen.lockedOut')}
                </Text>
                <Text style={[styles.lockoutMessage, { color: colors.textSecondary }]}>
                  {t('lockScreen.lockedOutMessage')}
                </Text>
                <Text style={[styles.lockoutTimer, { color: colors.textPrimary }]}>
                  {remainingTime}
                </Text>
              </View>
            ) : (
              <PinInput
                title={t('lockScreen.enterPin')}
                subtitle={t('lockScreen.enterPinSubtitle')}
                onPinComplete={handlePinComplete}
                errorMessage={errorMessage}
                onStartTyping={handleStartTyping}
                disabled={isPinDisabled}
              />
            )}
          </>
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
  lockoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  lockoutTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  lockoutMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  lockoutTimer: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
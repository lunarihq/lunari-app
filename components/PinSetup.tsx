import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { PinInput } from './PinInput';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import { router } from 'expo-router';
import { useTheme } from '../styles/theme';

interface PinSetupProps {
  mode?: 'setup' | 'change';
}

export function PinSetup({ mode = 'setup' }: PinSetupProps) {
  const { colors } = useTheme();
  const { setupPin } = useAuth();
  const [step, setStep] = useState<'verify' | 'initial' | 'confirm'>(
    mode === 'change' ? 'verify' : 'initial'
  );
  const [initialPin, setInitialPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCurrentPinComplete = async (pin: string) => {
    const isValid = await AuthService.verifyPin(pin);

    if (!isValid) {
      setErrorMessage('Incorrect current PIN. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setStep('initial');
    setErrorMessage('');
  };

  const handleInitialPinComplete = async (pin: string) => {
    setInitialPin(pin);
    setStep('confirm');
    setErrorMessage('');
  };

  const handleConfirmPinComplete = async (pin: string) => {
    if (pin !== initialPin) {
      setErrorMessage('PINs do not match. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
        setStep('initial');
        setInitialPin('');
      }, 2000);
      return;
    }

    try {
      const success = await setupPin(pin);
      if (success) {
        Alert.alert(
          mode === 'change'
            ? 'PIN Changed Successfully'
            : 'PIN Set Successfully',
          mode === 'change'
            ? 'Your PIN has been changed successfully.'
            : 'Your PIN has been set up. You can now use it to secure your app.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        setErrorMessage('Failed to set PIN. Please try again.');
        setTimeout(() => {
          setErrorMessage('');
          setStep(mode === 'change' ? 'verify' : 'initial');
          setInitialPin('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error setting up PIN:', error);
      setErrorMessage('Failed to set PIN. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
        setStep(mode === 'change' ? 'verify' : 'initial');
        setInitialPin('');
      }, 2000);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {step === 'verify' ? (
          <PinInput
            key="verify-pin"
            title="Enter Current PIN"
            subtitle="Enter your current PIN to continue"
            onPinComplete={handleCurrentPinComplete}
            errorMessage={errorMessage}
          />
        ) : step === 'initial' ? (
          <PinInput
            key="initial-pin"
            title={mode === 'change' ? 'Set New PIN' : 'Set PIN'}
            subtitle={
              mode === 'change'
                ? 'Choose a new 4-digit PIN'
                : 'Choose a 4-digit PIN to secure your app'
            }
            onPinComplete={handleInitialPinComplete}
            errorMessage={errorMessage}
          />
        ) : (
          <PinInput
            key="confirm-pin"
            title="Confirm PIN"
            subtitle="Enter your PIN again to confirm"
            onPinComplete={handleConfirmPinComplete}
            errorMessage={errorMessage}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

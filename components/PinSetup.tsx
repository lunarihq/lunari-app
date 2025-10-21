import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('settings');
  const { setupPin } = useAuth();
  const [step, setStep] = useState<'verify' | 'initial' | 'confirm'>(
    mode === 'change' ? 'verify' : 'initial'
  );
  const [initialPin, setInitialPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCurrentPinComplete = async (pin: string) => {
    const isValid = await AuthService.verifyPin(pin);

    if (!isValid) {
      setErrorMessage(t('pinSetup.verifyPin.error'));
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
      setErrorMessage(t('pinSetup.confirmPin.mismatch'));
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
            ? t('pinSetup.success.titleChange')
            : t('pinSetup.success.title'),
          mode === 'change'
            ? t('pinSetup.success.messageChange')
            : t('pinSetup.success.message'),
          [
            {
              text: t('pinSetup.success.ok'),
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        setErrorMessage(t('pinSetup.confirmPin.failed'));
        setTimeout(() => {
          setErrorMessage('');
          setStep(mode === 'change' ? 'verify' : 'initial');
          setInitialPin('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error setting up PIN:', error);
      setErrorMessage(t('pinSetup.confirmPin.failed'));
      setTimeout(() => {
        setErrorMessage('');
        setStep(mode === 'change' ? 'verify' : 'initial');
        setInitialPin('');
      }, 2000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {step === 'verify' ? (
          <PinInput
            key="verify-pin"
            title={t('pinSetup.verifyPin.title')}
            subtitle={t('pinSetup.verifyPin.subtitle')}
            onPinComplete={handleCurrentPinComplete}
            errorMessage={errorMessage}
          />
        ) : step === 'initial' ? (
          <PinInput
            key="initial-pin"
            title={
              mode === 'change'
                ? t('pinSetup.setPin.titleChange')
                : t('pinSetup.setPin.title')
            }
            subtitle={
              mode === 'change'
                ? t('pinSetup.setPin.subtitleChange')
                : t('pinSetup.setPin.subtitle')
            }
            onPinComplete={handleInitialPinComplete}
            errorMessage={errorMessage}
          />
        ) : (
          <PinInput
            key="confirm-pin"
            title={t('pinSetup.confirmPin.title')}
            subtitle={t('pinSetup.confirmPin.subtitle')}
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

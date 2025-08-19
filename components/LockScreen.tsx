import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PinInput } from './PinInput';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../app/styles/theme';

export function LockScreen() {
  const { colors } = useTheme();
  const {
    verifyPin,
    canUseBiometric,
    authenticateWithBiometric,
  } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [biometricAttempted, setBiometricAttempted] = useState(false);

  const handleBiometricAuth = useCallback(async () => {
    try {
      const success = await authenticateWithBiometric();
      if (!success) {
        // Biometric failed; user can use PIN
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  }, [authenticateWithBiometric]);

  // Automatically attempt biometric authentication when screen loads
  useEffect(() => {
    if (canUseBiometric && !biometricAttempted) {
      setBiometricAttempted(true);
      handleBiometricAuth();
    }
  }, [canUseBiometric, biometricAttempted, handleBiometricAuth]);

  const handlePinComplete = async (pin: string) => {
    const isValid = await verifyPin(pin);
    
    if (!isValid) {
      setErrorMessage('Incorrect PIN. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleStartTyping = () => {
    setErrorMessage('');
    // Reset biometric attempt so user can try biometric again after typing PIN
    setBiometricAttempted(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <PinInput
          title="Enter PIN"
          subtitle="Enter your 4-digit PIN to unlock"
          onPinComplete={handlePinComplete}
          errorMessage={errorMessage}
          onStartTyping={handleStartTyping}
        />
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
}); 
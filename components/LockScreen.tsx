import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PinInput } from './PinInput';
import { useAuth } from '../contexts/AuthContext';

export function LockScreen() {
  const {
    verifyPin,
    canUseBiometric,
    authenticateWithBiometric,
  } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [biometricAttempted, setBiometricAttempted] = useState(false);

  // Automatically attempt biometric authentication when screen loads
  useEffect(() => {
    if (canUseBiometric && !biometricAttempted) {
      setBiometricAttempted(true);
      handleBiometricAuth();
    }
  }, [canUseBiometric, biometricAttempted]);

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateWithBiometric();
      if (!success) {
        // Biometric failed or was cancelled, user can now use PIN
        // Don't show error message, just let them use PIN
        console.log('Biometric authentication failed, showing PIN input');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  };

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
    <SafeAreaView style={styles.container}>
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
    backgroundColor: '#ECEEFF',
  },
  content: {
    flex: 1,
  },
}); 
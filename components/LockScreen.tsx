import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PinInput } from './PinInput';
import { useAuth } from '../contexts/AuthContext';

export function LockScreen() {
  const {
    verifyPin,
    canUseBiometric,
    authenticateWithBiometric,
    getBiometricType,
  } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [biometricType, setBiometricType] = useState('Biometric');

  useEffect(() => {
    const loadBiometricType = async () => {
      if (canUseBiometric) {
        const type = await getBiometricType();
        setBiometricType(type);
      }
    };
    loadBiometricType();
  }, [canUseBiometric, getBiometricType]);

  const handlePinComplete = async (pin: string) => {
    const isValid = await verifyPin(pin);
    
    if (!isValid) {
      setErrorMessage('Incorrect PIN. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleStartTyping = () => {
    setErrorMessage('');
  };

  const handleBiometricPress = async () => {
    const success = await authenticateWithBiometric();
    if (!success) {
      setErrorMessage('Biometric authentication failed.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getBiometricIcon = () => {
    if (biometricType === 'Face ID') return 'face-recognition';
    if (biometricType === 'Touch ID') return 'finger-print';
    return 'finger-print';
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
          showBiometric={canUseBiometric}
          onBiometricPress={handleBiometricPress}
          biometricIcon={getBiometricIcon()}
          biometricLabel={`Use ${biometricType}`}
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
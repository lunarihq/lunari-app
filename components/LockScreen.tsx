import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PinInput } from './PinInput';
import { useAuth } from '../contexts/AuthContext';

export function LockScreen() {
  const {
    verifyPin,
  } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');

  const handlePinComplete = async (pin: string) => {
    const isValid = await verifyPin(pin);
    
    if (!isValid) {
      setErrorMessage('Incorrect PIN. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PinInput
          title="Enter PIN"
          subtitle="Enter your 4-digit PIN to unlock"
          onPinComplete={handlePinComplete}
          errorMessage={errorMessage}
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
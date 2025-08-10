import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../app/styles/colors';

interface PinInputProps {
  title: string;
  subtitle?: string;
  onPinComplete: (pin: string) => void;
  showBiometric?: boolean;
  onBiometricPress?: () => void;
  biometricIcon?: string;
  biometricLabel?: string;
  errorMessage?: string;
  onStartTyping?: () => void;
}

export function PinInput({
  title,
  subtitle,
  onPinComplete,
  showBiometric = false,
  onBiometricPress,
  biometricIcon = 'finger-print',
  biometricLabel = 'Use Biometric',
  errorMessage,
  onStartTyping,
}: PinInputProps) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);

  const PIN_LENGTH = 4;

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      onPinComplete(pin);
    }
  }, [pin, onPinComplete]);

  useEffect(() => {
    if (errorMessage) {
      Vibration.vibrate(500);
      setAttempts(prev => prev + 1);
      setPin('');
    }
  }, [errorMessage]);

  const handleNumberPress = (number: string) => {
    if (pin.length >= PIN_LENGTH) return;
    
    // Clear error message when user starts typing
    if (pin.length === 0 && onStartTyping) {
      onStartTyping();
    }
    
    setPin(prev => prev + number);
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const renderPinDots = () => {
    return (
      <View style={styles.pinContainer}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              index < pin.length && styles.pinDotFilled,
              errorMessage && styles.pinDotError,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace'],
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, colIndex) => {
              if (item === '') {
                return <View key={colIndex} style={styles.numberButton} />;
              }
              
              if (item === 'backspace') {
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.numberButton}
                    onPress={handleBackspace}
                  >
                    <Ionicons name="backspace-outline" size={24} color="#333" />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(item)}
                >
                  <Text style={styles.numberText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {renderPinDots()}

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {renderNumberPad()}

      {showBiometric && onBiometricPress && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={onBiometricPress}
        >
          <Ionicons name={biometricIcon as any} size={24} color="#4561D2" />
          <Text style={styles.biometricText}>{biometricLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ccc',
    marginHorizontal: 10,
  },
  pinDotFilled: {
    backgroundColor: '#4561D2',
    borderColor: '#4561D2',
  },
  pinDotError: {
    borderColor: '#ff4757',
    backgroundColor: 'transparent',
  },
  numberPad: {
    alignItems: 'center',
    marginBottom: 20,
  },
  numberRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  numberButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  numberText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  errorText: {
    color: '#ff4757',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  biometricText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4561D2',
    fontWeight: '500',
  },
}); 
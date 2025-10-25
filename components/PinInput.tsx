import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';

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
  disabled?: boolean;
}

export function PinInput({
  title,
  subtitle,
  onPinComplete,
  showBiometric = false,
  onBiometricPress,
  biometricIcon = 'finger-print',
  biometricLabel,
  errorMessage,
  onStartTyping,
  disabled = false,
}: PinInputProps) {
  const { colors } = useTheme();
  const { typography } = useAppStyles();
  const [pin, setPin] = useState('');

  const PIN_LENGTH = 4;

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      onPinComplete(pin);
    }
  }, [pin, onPinComplete]);

  useEffect(() => {
    if (errorMessage) {
      Vibration.vibrate(500);

      setPin('');
    }
  }, [errorMessage]);

  const handleNumberPress = (number: string) => {
    if (disabled || pin.length >= PIN_LENGTH) return;

    // Clear error message when user starts typing
    if (pin.length === 0 && onStartTyping) {
      onStartTyping();
    }

    setPin(prev => prev + number);
  };

  const handleBackspace = () => {
    if (disabled) return;
    setPin(prev => prev.slice(0, -1));
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
                return (
                  <View
                    key={colIndex}
                    style={[
                      styles.numberButton,
                      {
                        backgroundColor: colors.background,
                        shadowOpacity: 0,
                        elevation: 0,
                      },
                    ]}
                  />
                );
              }

              if (item === 'backspace') {
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.numberButton,
                      { backgroundColor: colors.surface },
                      disabled && styles.numberButtonDisabled,
                    ]}
                    onPress={handleBackspace}
                    disabled={disabled}
                  >
                    <Ionicons
                      name="backspace-outline"
                      size={24}
                      color={disabled ? colors.textSecondary : colors.textPrimary}
                    />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.numberButton,
                    { backgroundColor: colors.surface },
                    disabled && styles.numberButtonDisabled,
                  ]}
                  onPress={() => handleNumberPress(item)}
                  disabled={disabled}
                >
                  <Text
                    style={[
                      typography.headingMd,
                      { 
                        fontSize: 24, 
                        fontWeight: '600',
                        color: disabled ? colors.textSecondary : colors.textPrimary,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[
            typography.headingMd,
            { textAlign: 'center', marginBottom: 8 },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: 'center' },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.pinContainer}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              { borderColor: colors.border },
              index < pin.length && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
              errorMessage && styles.pinDotError,
            ]}
          />
        ))}
      </View>

      {errorMessage && (
        <Text
          style={[
            typography.body,
            { color: '#ff4757', textAlign: 'center', marginBottom: 20 },
          ]}
        >
          {errorMessage}
        </Text>
      )}

      {renderNumberPad()}

      {showBiometric && onBiometricPress && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={onBiometricPress}
        >
          <Ionicons
            name={biometricIcon as any}
            size={24}
            color={colors.primary}
          />
          <Text
            style={[
              typography.body,
              { color: colors.primary, marginLeft: 8, fontWeight: '500' },
            ]}
          >
            {biometricLabel}
          </Text>
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pinDot: {
    width: 24,
    height: 24,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 2,
    marginHorizontal: 10,
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
  numberButtonDisabled: {
    opacity: 0.4,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});

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

const PIN_LENGTH = 4;
const NUMBER_PAD_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

interface PinInputProps {
  title: string;
  subtitle?: string;
  onPinComplete: (pin: string) => void;
  errorMessage?: string;
  onStartTyping?: () => void;
  disabled?: boolean;
}

interface NumberButtonProps {
  number: string;
  onPress: () => void;
  disabled: boolean;
}

interface BackspaceButtonProps {
  onPress: () => void;
  disabled: boolean;
}

function NumberButton({ number, onPress, disabled }: NumberButtonProps) {
  const { colors } = useTheme();
  const { typography } = useAppStyles();

  return (
    <TouchableOpacity
      style={[
        styles.numberButton,
        { backgroundColor: colors.surface },
        disabled && styles.numberButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          typography.headingMd,
          {
            color: disabled ? colors.textSecondary : colors.textPrimary,
          },
        ]}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );
}

function BackspaceButton({ onPress, disabled }: BackspaceButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.numberButton,
        { backgroundColor: colors.surface },
        disabled && styles.numberButtonDisabled,
      ]}
      onPress={onPress}
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

function EmptyButton() {
  const { colors } = useTheme();

  return (
    <View
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

function PinDots({ length, filled, hasError }: { length: number; filled: number; hasError: boolean }) {
  const { colors } = useTheme();

  return (
    <View style={styles.pinContainer}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.pinDot,
            { borderColor: colors.border },
            index < filled && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
            hasError && styles.pinDotError,
          ]}
        />
      ))}
    </View>
  );
}

export function PinInput({
  title,
  subtitle,
  onPinComplete,
  errorMessage,
  onStartTyping,
  disabled = false,
}: PinInputProps) {
  const { colors } = useTheme();
  const { typography } = useAppStyles();
  const [pin, setPin] = useState('');

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

    if (pin.length === 0 && onStartTyping) {
      onStartTyping();
    }

    setPin(prev => prev + number);
  };

  const handleBackspace = () => {
    if (disabled) return;
    setPin(prev => prev.slice(0, -1));
  };

  const renderButton = (item: string, index: number) => {
    if (item === '') return <EmptyButton key={index} />;
    
    if (item === 'backspace') {
      return <BackspaceButton key={index} onPress={handleBackspace} disabled={disabled} />;
    }
    
    return (
      <NumberButton
        key={index}
        number={item}
        onPress={() => handleNumberPress(item)}
        disabled={disabled}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[typography.headingMd, styles.title]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[typography.body, { color: colors.textSecondary }, styles.subtitle]}>
            {subtitle}
          </Text>
        )}
      </View>

      <PinDots length={PIN_LENGTH} filled={pin.length} hasError={!!errorMessage} />

      {errorMessage && (
        <Text style={[typography.body, styles.errorText]}>
          {errorMessage}
        </Text>
      )}

      <View style={styles.numberPad}>
        {NUMBER_PAD_LAYOUT.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, colIndex) => renderButton(item, colIndex))}
          </View>
        ))}
      </View>

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
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
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
  errorText: {
    color: '#ff4757',
    textAlign: 'center',
    marginBottom: 20,
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
});

import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'contained' | 'text' | 'outlined';
  shadow?: boolean;
  style?: any;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'contained', shadow = false, style, disabled = false }: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'text':
        return { backgroundColor: 'transparent' };
      case 'outlined':
        return { 
          backgroundColor: 'transparent', 
          borderWidth: 1, 
          borderColor: colors.primary 
        };
      case 'contained':
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'text':
      case 'outlined':
        return colors.primary;
      case 'contained':
      default:
        return colors.white;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        shadow && styles.shadow,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 80,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.7,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

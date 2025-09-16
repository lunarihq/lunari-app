import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

export function Button({ title, onPress, style, disabled = false }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.white }]}>{title}</Text>
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
});

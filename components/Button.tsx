import React, { useMemo } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'contained' | 'text' | 'outlined';
  shadow?: boolean;
  fullWidth?: boolean;
  style?: any;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'contained',
  shadow = false,
  fullWidth = false,
  style,
  disabled = false,
}: ButtonProps) {
  const { colors } = useTheme();
  const { typography } = useAppStyles();

  const buttonStyle = useMemo(() => {
    switch (variant) {
      case 'text':
        return { backgroundColor: 'transparent' };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'contained':
      default:
        return { backgroundColor: colors.primary };
    }
  }, [variant, colors.primary]);

  const textColor = useMemo(() => {
    switch (variant) {
      case 'text':
      case 'outlined':
        return colors.primary;
      case 'contained':
      default:
        return colors.white;
    }
  }, [variant, colors.primary, colors.white]);

  const textStyle = useMemo(
    () => [typography.body, { fontWeight: '500', color: textColor }],
    [typography.body, textColor]
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={textStyle}>
        {title}
      </Text>
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
  disabled: {
    opacity: 0.38,
  },
  pressed: {
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';

interface LinkButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;
  iconSize?: number;
  style?: any;
}

export function LinkButton({
  title,
  onPress,
  iconName = 'chevron-forward',
  iconSize = 16,
  style,
}: LinkButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: colors.primary }]}>{title}</Text>
        <Ionicons
          name={iconName as any}
          size={iconSize}
          color={colors.primary}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    marginTop: 3,
  },
});

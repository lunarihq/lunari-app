import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { createTypography } from '../styles/typography';

export function ThemeToggle() {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const typography = createTypography(colors);

  const themeOptions: { mode: ThemeMode; label: string }[] = [
    { mode: 'light', label: 'Light' },
    { mode: 'dark', label: 'Dark' },
    { mode: 'system', label: 'System' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text
        style={[
          typography.body,
          { fontSize: 18, fontWeight: '600', marginBottom: 12 },
        ]}
      >
        Theme
      </Text>
      <View style={styles.optionsContainer}>
        {themeOptions.map(option => (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.option,
              {
                backgroundColor:
                  themeMode === option.mode ? colors.primary : colors.panel,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setThemeMode(option.mode)}
          >
            <Text
              style={[
                typography.caption,
                {
                  fontSize: 14,
                  fontWeight: '500',
                  color:
                    themeMode === option.mode
                      ? colors.white
                      : colors.textPrimary,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, textAlign: 'center' },
        ]}
      >
        Current: {isDark ? 'Dark' : 'Light'} mode
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { lightColors, darkColors } from '../styles/colors';

interface LockScreenProps {
  onUnlock: () => void;
  isOverlay?: boolean;
}

export function LockScreen({ onUnlock, isOverlay = false }: LockScreenProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation('settings');
  const colors = isDark ? darkColors : lightColors;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      ...(isOverlay ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      } : {
        flex: 1,
      }),
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      marginBottom: 24,
      color: colors.textPrimary,
    },
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  }), [colors, isOverlay]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('lockScreen.unlockApp')}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onUnlock}
        accessibilityRole="button"
        accessibilityLabel={t('lockScreen.unlockButton')}
      >
        <Text style={styles.buttonText}>{t('lockScreen.unlockButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ColorScheme } from '../styles/colors';

interface DayPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}

export function DayPicker({
  value,
  onChange,
  min,
  max,
  disabled = false,
}: DayPickerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('common');
  const styles = useMemo(() => createStyles(colors), [colors]);

  const increment = () => {
    onChange(Math.min(value + 1, max));
  };

  const decrement = () => {
    onChange(Math.max(value - 1, min));
  };

  return (
    <View style={[styles.pickerContainer, disabled && styles.pickerDisabled]}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={decrement}
        disabled={disabled}
      >
        <Ionicons
          name="remove"
          size={32}
          color={colors.white}
        />
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>
          {value}
        </Text>
        <Text style={styles.labelText}>
          {t('time.days')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={increment}
        disabled={disabled}
      >
        <Ionicons
          name="add"
          size={32}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingBottom: 24,
      paddingTop: 16,
      borderRadius: 12,
    },
    pickerDisabled: {
      opacity: 0.38,
    },
    pickerButton: {
      width: 54,
      height: 54,
      borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    valueContainer: {
      alignItems: 'center',
      minWidth: 80,
    },
    valueText: {
      fontSize: 54,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    labelText: {
      fontSize: 20,
      color: colors.textSecondary,
    },
  });

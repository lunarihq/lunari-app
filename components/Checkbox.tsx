import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ColorScheme } from '../styles/colors';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  text?: string;
  subText?: string;
}

export function Checkbox({
  checked,
  onToggle,
  text,
  subText,
}: CheckboxProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('onboarding');
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const defaultText = text || t('periodLength.checkboxText');

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.checkboxContainer}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: colors.primary,
              backgroundColor: checked ? colors.primary : 'transparent',
            },
            checked && styles.checkboxChecked,
          ]}
        >
          {checked && (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          )}
        </View>
        <Text style={styles.text}>{defaultText}</Text>
      </View>
      {subText && <Text style={styles.subText}>{subText}</Text>}
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 4,
      gap: 4,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2.5,
      borderRadius: 16,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {},
    text: {
      fontSize: 18,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    subText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 6,
      paddingHorizontal: 8,
    },
  });

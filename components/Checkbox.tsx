import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  text = "Don't know - let the app learn",
  subText,
}: CheckboxProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.checkboxContainer}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: colors.primary,
              backgroundColor: checked ? colors.primary : colors.surface,
            },
            checked && styles.checkboxChecked,
          ]}
        >
          {checked && (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          )}
        </View>
        <Text style={styles.text}>{text}</Text>
      </View>
      {subText && <Text style={styles.subText}>{subText}</Text>}
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 20,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
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
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 5,
      lineHeight: 18,
    },
  });

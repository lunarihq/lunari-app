import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting } from '../../db';
import { createOnboardingStyles } from '../../styles/onboarding';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorScheme } from '../../styles/colors';

export default function PeriodLengthScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const styles = createStyles(colors);
  const [periodLength, setPeriodLength] = useState(5);
  const [dontKnow, setDontKnow] = useState(false);

  const handleNext = async () => {
    try {
      // Only save period length setting if user didn't select "don't know"
      if (!dontKnow) {
        await setSetting('userPeriodLength', periodLength.toString());
      }
      router.push({ pathname: '/onboarding/cycle-length' });
    } catch (error) {
      console.error('Error saving period length:', error);
      router.push({ pathname: '/onboarding/cycle-length' });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const incrementPeriodLength = () => {
    setPeriodLength(prev => Math.min(prev + 1, 10)); // Max 10 days
  };

  const decrementPeriodLength = () => {
    setPeriodLength(prev => Math.max(prev - 1, 1)); // Min 1 day
  };

  const toggleDontKnow = () => {
    setDontKnow(!dontKnow);
  };

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
        <TouchableOpacity style={onboardingStyles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={onboardingStyles.paginationContainer}>
          <View style={[onboardingStyles.paginationDot, onboardingStyles.paginationDotActive]} />
          <View style={onboardingStyles.paginationDot} />
          <View style={onboardingStyles.paginationDot} />
        </View>
        <View style={onboardingStyles.headerSpacer} />
      </View>

      <View style={onboardingStyles.content}>
        <Text style={onboardingStyles.title}>How long is your period?</Text>
        <Text style={onboardingStyles.message}>
          This helps us provide more accurate predictions for your cycle.
        </Text>

        <View
          style={[styles.pickerContainer, dontKnow && styles.pickerDisabled]}
        >
          <TouchableOpacity
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]}
            onPress={decrementPeriodLength}
            disabled={dontKnow}
          >
            <Ionicons
              name="remove"
              size={24}
              color={dontKnow ? colors.textMuted : colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.valueContainer}>
            <Text style={[styles.valueText, dontKnow && styles.textDisabled]}>
              {periodLength}
            </Text>
            <Text style={[styles.labelText, dontKnow && styles.textDisabled]}>
              days
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]}
            onPress={incrementPeriodLength}
            disabled={dontKnow}
          >
            <Ionicons
              name="add"
              size={24}
              color={dontKnow ? colors.textMuted : colors.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dontKnowContainer}
          onPress={toggleDontKnow}
        >
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, { borderColor: colors.primary, backgroundColor: dontKnow ? colors.primary : colors.surface }, dontKnow && styles.checkboxChecked]}>
              {dontKnow && <Ionicons name="checkmark" size={16} color={colors.white} />}
            </View>
            <Text style={styles.dontKnowText}>
              Don't know - let the app learn
            </Text>
          </View>
          <Text style={styles.dontKnowSubText}>Uses 5 days as default</Text>
        </TouchableOpacity>
      </View>

      <View style={onboardingStyles.footer}>
        <TouchableOpacity style={onboardingStyles.fullWidthButton} onPress={handleNext}>
          <Text style={onboardingStyles.fullWidthButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) => StyleSheet.create({
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    pickerDisabled: {
      opacity: 0.5,
    },
    pickerButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    buttonDisabled: {
      backgroundColor: colors.panel,
    },
    valueContainer: {
      alignItems: 'center',
      minWidth: 80,
    },
    valueText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.primary,
    },
    textDisabled: {
      color: colors.textMuted,
    },
    labelText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 5,
    },
    dontKnowContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderRadius: 3,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {},
    dontKnowText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    dontKnowSubText: {
      fontSize: 14,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
});

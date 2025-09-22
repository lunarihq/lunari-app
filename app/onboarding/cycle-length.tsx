import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting } from '../../db';
import { createOnboardingStyles } from '../../styles/onboarding';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorScheme } from '../../styles/colors';

export default function CycleLengthScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const styles = createStyles(colors);
  const [cycleLength, setCycleLength] = useState(28);
  const [dontKnow, setDontKnow] = useState(false);

  const handleGetStarted = async () => {
    try {
      // Only save cycle length setting if user didn't select "don't know"
      if (!dontKnow) {
        await setSetting('userCycleLength', cycleLength.toString());
      }

      // Navigate to last period date screen
      router.push({ pathname: '/onboarding/last-period-date' });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const incrementCycleLength = () => {
    setCycleLength(prev => Math.min(prev + 1, 45)); // Max 45 days
  };

  const decrementCycleLength = () => {
    setCycleLength(prev => Math.max(prev - 1, 21)); // Min 21 days
  };

  const toggleDontKnow = () => {
    setDontKnow(!dontKnow);
  };

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
        <TouchableOpacity
          style={onboardingStyles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={onboardingStyles.paginationContainer}>
          <View style={onboardingStyles.paginationDot} />
          <View
            style={[
              onboardingStyles.paginationDot,
              onboardingStyles.paginationDotActive,
            ]}
          />
          <View style={onboardingStyles.paginationDot} />
        </View>
        <View style={onboardingStyles.headerSpacer} />
      </View>

      <View style={onboardingStyles.content}>
        <Text style={onboardingStyles.title}>
          How many days does your cycle last on average?
        </Text>
        <Text style={onboardingStyles.message}>
          This is the number of days from the start of one period to the start
          of the next.
        </Text>

        <View
          style={[styles.pickerContainer, dontKnow && styles.pickerDisabled]}
        >
          <TouchableOpacity
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]}
            onPress={decrementCycleLength}
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
              {cycleLength}
            </Text>
            <Text style={[styles.labelText, dontKnow && styles.textDisabled]}>
              days
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]}
            onPress={incrementCycleLength}
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
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: colors.primary,
                  backgroundColor: dontKnow ? colors.primary : colors.surface,
                },
                dontKnow && styles.checkboxChecked,
              ]}
            >
              {dontKnow && (
                <Ionicons name="checkmark" size={16} color={colors.white} />
              )}
            </View>
            <Text style={styles.dontKnowText}>
              Don't know - let the app learn
            </Text>
          </View>
          <Text style={styles.dontKnowSubText}>Uses 28 days as default</Text>
        </TouchableOpacity>

        <Text style={styles.subMessage}>
          Don't worry, we'll learn your actual patterns as you track!
        </Text>
      </View>

      <View style={onboardingStyles.footer}>
        <Button title="Next" onPress={handleGetStarted} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
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
    subMessage: {
      fontSize: 14,
      textAlign: 'left',
      color: colors.textMuted,
      fontStyle: 'italic',
      lineHeight: 20,
    },
  });

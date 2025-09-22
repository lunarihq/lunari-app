import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../components/Button';
import { DayPicker } from '../../components/DayPicker';
import { Checkbox } from '../../components/Checkbox';
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

        <DayPicker
          value={cycleLength}
          onChange={setCycleLength}
          min={21}
          max={45}
          disabled={dontKnow}
        />

        <Checkbox
          checked={dontKnow}
          onToggle={toggleDontKnow}
          subText="Uses 28 days as default"
        />

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
    subMessage: {
      fontSize: 14,
      textAlign: 'left',
      color: colors.textMuted,
      fontStyle: 'italic',
      lineHeight: 20,
    },
  });

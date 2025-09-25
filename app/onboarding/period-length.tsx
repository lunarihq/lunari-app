import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from '../../components/Button';
import { DayPicker } from '../../components/DayPicker';
import { Checkbox } from '../../components/Checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting } from '../../db';
import { createOnboardingStyles } from '../../styles/onboarding';
import { useTheme, createTypography } from '../../styles/theme';

export default function PeriodLengthScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const typography = createTypography(colors);
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
          <View
            style={[
              onboardingStyles.paginationDot,
              onboardingStyles.paginationDotActive,
            ]}
          />
          <View style={onboardingStyles.paginationDot} />
          <View style={onboardingStyles.paginationDot} />
        </View>
        <View style={onboardingStyles.headerSpacer} />
      </View>

      <View style={onboardingStyles.content}>
        <Text
          style={[typography.heading2, { marginBottom: 20, textAlign: 'left' }]}
        >
          How long is your period?
        </Text>
        <Text
          style={[
            typography.body,
            {
              textAlign: 'left',
              lineHeight: 22,
              color: colors.textSecondary,
              marginBottom: 40,
            },
          ]}
        >
          This helps us provide more accurate predictions for your cycle.
        </Text>

        <DayPicker
          value={periodLength}
          onChange={setPeriodLength}
          min={1}
          max={10}
          disabled={dontKnow}
        />

        <Checkbox
          checked={dontKnow}
          onToggle={toggleDontKnow}
          subText="Starts with 5 days, and then adjust as you log cycles."
        />
      </View>

      <View style={onboardingStyles.footer}>
        <Button title="Continue" onPress={handleNext} fullWidth />
      </View>
    </SafeAreaView>
  );
}

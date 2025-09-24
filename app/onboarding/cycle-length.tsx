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
import { createTypography } from '../../styles/typography';
import { useTheme } from '../../contexts/ThemeContext';

export default function CycleLengthScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const typography = createTypography(colors);
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
        <Text
          style={[typography.heading2, { marginBottom: 20, textAlign: 'left' }]}
        >
          How many days does your cycle last on average?
        </Text>
        <Text
          style={[
            typography.body,
            {
              textAlign: 'left',
              marginBottom: 40,
              lineHeight: 22,
              color: colors.textSecondary,
            },
          ]}
        >
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
          subText="The app will use 28 days as default, and then it will be adjusted as you log your cycles."
        />
      </View>

      <View style={onboardingStyles.footer}>
        <Button title="Next" onPress={handleGetStarted} fullWidth />
      </View>
    </SafeAreaView>
  );
}

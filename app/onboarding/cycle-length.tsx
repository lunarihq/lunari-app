import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('onboarding');
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
          style={[typography.headingMd, { marginBottom: 20, textAlign: 'left' }]}
        >
          {t('cycleLength.title')}
        </Text>
        <Text
          style={[
            typography.body,
            {
              textAlign: 'left',
              marginBottom: 40,
              color: colors.textSecondary,
            },
          ]}
        >
          {t('cycleLength.subtitle')}
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
          text={t('cycleLength.checkboxText')}
          subText={t('cycleLength.checkboxSubtext')}
        />
      </View>

      <View style={onboardingStyles.footer}>
        <Button title={t('continue')} onPress={handleGetStarted} fullWidth />
      </View>
    </SafeAreaView>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { createTypography } from '../../styles/typography';
import { createOnboardingStyles } from '../../styles/onboarding';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const onboardingStyles = createOnboardingStyles(colors);

  const handleNext = () => {
    router.push({ pathname: '/onboarding/period-length' });
  };

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View
        style={[
          onboardingStyles.content,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text
          style={[
            typography.heading1,
            { marginBottom: 20, textAlign: 'center' },
          ]}
        >
          Your Body, Your Data
        </Text>
        <Text
          style={[typography.body, { marginBottom: 40, textAlign: 'center' }]}
        >
          Private period tracking that never leaves your phone.
        </Text>
      </View>

      <View style={onboardingStyles.footer}>
        <Button title="Next" onPress={handleNext} fullWidth />
      </View>
    </SafeAreaView>
  );
}

import React from 'react';
import { View, Text, Image } from 'react-native';
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
        <Image
          source={require('../../assets/icons/lunari-logo.png')}
          style={{ width: 120, height: 120, marginBottom: 32 }}
          resizeMode="contain"
        />
        <Text
          style={[
            typography.heading1,
            { fontSize: 36, lineHeight: 44, marginBottom: 20, textAlign: 'center' },
          ]}
        >
          Your Body, Your Data.
        </Text>
        <Text
          style={[typography.body, { fontSize: 18, lineHeight: 24, marginBottom: 40, textAlign: 'center' }]}
        >
          Period tracking that never leaves your phone.
        </Text>
      </View>

      <View style={onboardingStyles.footer}>
        <Button title="Continue" onPress={handleNext} fullWidth />
      </View>
    </SafeAreaView>
  );
}

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { onboardingStyles } from '../styles/onboarding';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push({ pathname: '/onboarding/period-length' });
  };

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
      </View>

      <View style={onboardingStyles.content}>
        <Text style={onboardingStyles.title}>Welcome to the App</Text>
        <Text style={onboardingStyles.message}>
          Track your health and wellness with our easy-to-use app.
        </Text>
      </View>

      <View style={onboardingStyles.footer}>
        <TouchableOpacity style={onboardingStyles.fullWidthButton} onPress={handleNext}>
          <Text style={onboardingStyles.fullWidthButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// No local styles needed - using shared onboardingStyles

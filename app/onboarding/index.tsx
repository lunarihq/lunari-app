import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
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
        <View style={onboardingStyles.headerSpacer} />
        <View style={onboardingStyles.paginationContainer}>
          <View style={[onboardingStyles.paginationDot, onboardingStyles.paginationDotActive]} />
          <View style={onboardingStyles.paginationDot} />
          <View style={onboardingStyles.paginationDot} />
        </View>
        <View style={onboardingStyles.headerSpacer} />
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

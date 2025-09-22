import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { createTypography } from '../../styles/typography';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleNext = () => {
    router.push({ pathname: '/onboarding/period-length' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[typography.heading1, { marginBottom: 20 }, ]}>Welcome to the App</Text>
        <Text style={[typography.body, { marginBottom: 40, textAlign: 'center' }]}>
          Track your health and wellness with our easy-to-use app. This is a test.
        </Text>

        <Button title="Next" onPress={handleNext} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { createTypography } from '../../styles/typography';
import { createOnboardingStyles } from '../../styles/onboarding';
import { Shape1, Shape2 } from '../../components/illustrations';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const onboardingStyles = createOnboardingStyles(colors);

  const handleNext = () => {
    router.push({ pathname: '/onboarding/period-length' });
  };

  return (
    <SafeAreaView
      style={[onboardingStyles.container, { backgroundColor: colors.panel }]}
    >
      <Shape1 style={styles.shape1} color={colors.shape1} />
      <Shape2 style={styles.shape2} color={colors.shape2} />

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
            { color: colors.primary },
            {
              fontSize: 33,
              lineHeight: 44,
              marginBottom: 20,
              textAlign: 'center',
              fontFamily: 'BricolageGrotesque_700Bold',
            },
          ]}
        >
          Your period, your data.
        </Text>
        <Text
          style={[
            typography.body,
            {
              fontSize: 18,
              lineHeight: 24,
              marginBottom: 40,
              textAlign: 'center',
              paddingHorizontal: 16,
            },
          ]}
        >
          Track your menstrual cycle without giving up your privacy.
        </Text>
      </View>

      <View style={onboardingStyles.footer}>
        <Button title="Get started" onPress={handleNext} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shape1: {
    position: 'absolute',
    top: 0,
    left: -20,
    width: 325,
    height: 325,
  },
  shape2: {
    position: 'absolute',
    bottom: -80,
    right: -100,
    width: 381,
    height: 291,
  },
});

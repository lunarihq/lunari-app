import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../hooks/useStyles';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function SuccessScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { typography } = useAppStyles();
  const { t } = useTranslation('onboarding');

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
    opacity.value = withTiming(1, { duration: 300 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleStartTracking = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkmarkContainer,
            { backgroundColor: colors.accentPink },
            checkmarkStyle,
          ]}
        >
          <Ionicons name="checkmark" size={60} color={colors.white} />
        </Animated.View>

        <Text
          style={[
            typography.headingLg,
            { marginTop: 32, marginBottom: 16, textAlign: 'center' },
          ]}
        >
          {t('success.title')}
        </Text>

        <Text
          style={[
            typography.body,
            {
              textAlign: 'center',
              color: colors.textSecondary,
              paddingHorizontal: 16,
              fontSize: 18,
              lineHeight: 24,
            },
          ]}
        >
          {t('success.subtitle')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title={t('success.button')}
          onPress={handleStartTracking}
          fullWidth
        />
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
    paddingHorizontal: 24,
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 10,
  },
});
